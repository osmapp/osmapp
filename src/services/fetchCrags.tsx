import { fetchJson } from './fetch';
import {
  Feature,
  FeatureGeometry,
  FeatureTags,
  LineString,
  Point,
  OsmId,
} from './types';
import { getPoiClass } from './getPoiClass';
import { getCenter } from './getCenter';
import { join, publishDbgObject } from '../utils';

// inspired by overpassSearch - but this computes all geometries (doesnt fetch them by 'geom' modifier)

const convertOsmIdToMapId = (apiId: OsmId) => {
  const osmToMapType = { node: 0, way: 1, relation: 4 };
  return parseInt(`${apiId.id}${osmToMapType[apiId.type]}`, 10);
};

const getItems = (elements) => {
  const nodes = [];
  const ways = [];
  const relations = [];
  elements.forEach((element) => {
    if (element.type === 'node') {
      nodes.push(element);
    } else if (element.type === 'way') {
      ways.push(element);
    } else if (element.type === 'relation') {
      relations.push(element);
    }
  });
  return { nodes, ways, relations };
};

const numberToSuperScript = (number?: number) =>
  number?.toString().replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]);

const getLabel = (tags: FeatureTags, osmappRouteCount) =>
  join(tags.name, '\n', numberToSuperScript(osmappRouteCount));

const convert = (
  element: any,
  geometryFn: (element: any) => FeatureGeometry,
): Feature => {
  const { type, id, tags = {} } = element;
  const geometry = geometryFn(element);
  const center = getCenter(geometry) ?? undefined;
  const osmappRouteCount =
    element.tags.climbing === 'crag'
      ? (element.members?.length ??
        parseInt(element.tags['climbing:sport'] ?? 0, 10))
      : undefined;
  const properties = {
    ...getPoiClass(tags),
    ...tags,
    osmappType: type,
    osmappRouteCount,
    osmappLabel: getLabel(tags, osmappRouteCount),
    osmappHasImages: Object.keys(tags).some((key) =>
      key.startsWith('wikimedia_commons'),
    ),
  };

  return {
    type: 'Feature',
    id: convertOsmIdToMapId({ type, id }),
    osmMeta: { type, id },
    tags,
    properties,
    geometry,
    center,
    members: element.members,
  };
};

const getNodeGeomFn =
  () =>
  (node: any): Point => ({
    type: 'Point',
    coordinates: [node.lon, node.lat],
  });

const getWayGeomFn =
  (lookup) =>
  ({ nodes }): LineString => ({
    type: 'LineString' as const,
    coordinates: nodes
      .map((ref) => lookup.node[ref]?.geometry?.coordinates)
      .filter(Boolean), // some nodes may be missing
  });

function getRelationGeomFn(lookup) {
  return ({ center, members }): FeatureGeometry => {
    const geometries = members
      .map(({ type, ref }) => lookup[type][ref]?.geometry)
      .filter(Boolean); // some members may be undefined in first pass

    return geometries.length
      ? {
          type: 'GeometryCollection',
          geometries,
        }
      : center
        ? { type: 'Point', coordinates: [center.lon, center.lat] }
        : undefined;
  };
}

const addToLookup = (items: Feature[], lookup) => {
  items.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    lookup[item.osmMeta.type][item.osmMeta.id] = item;
  });
};

const getRelationWithAreaCount = (
  relations: Feature[],
  lookup: Record<string, Record<string, Feature>>,
) =>
  relations.map((relation) => {
    if (relation.tags.climbing === 'area') {
      const members = relation.members.map(
        ({ type, ref }) => lookup[type][ref]?.properties,
      );
      const osmappRouteCount = members
        .map((member) => member?.osmappRouteCount ?? 0)
        .reduce((acc, count) => acc + count);
      const osmappHasImages = members
        .map((member) => member?.osmappHasImages)
        .some((value) => value === true);

      return {
        ...relation,
        properties: {
          ...relation.properties,
          osmappRouteCount,
          osmappHasImages,
          osmappLabel: getLabel(relation.tags, osmappRouteCount),
        },
      };
    }

    return relation;
  });

export const cragsToGeojson = (response: any): Feature[] => {
  const { nodes, ways, relations } = getItems(response.elements);

  const lookup = { node: {}, way: {}, relation: {} } as Record<
    string,
    Record<string, Feature>
  >;

  const NODE_GEOM = getNodeGeomFn();
  const nodesOut = nodes.map((node) => convert(node, NODE_GEOM));
  addToLookup(nodesOut, lookup);

  const WAY_GEOM = getWayGeomFn(lookup);
  const waysOut = ways.map((way) => convert(way, WAY_GEOM));
  addToLookup(waysOut, lookup);

  // first pass
  const RELATION_GEOM1 = getRelationGeomFn(lookup);
  const relationsOut1 = relations.map((relation) =>
    convert(relation, RELATION_GEOM1),
  );
  addToLookup(relationsOut1, lookup);

  // second pass for climbing=area geometries
  // TODO: loop while number of geometries changes
  // TODO: update only geometries (?)
  const RELATION_GEOM2 = getRelationGeomFn(lookup);
  const relationsOut2 = relations.map((relation) =>
    convert(relation, RELATION_GEOM2),
  );

  const relationsOut3 = getRelationWithAreaCount(relationsOut2, lookup);

  return [...nodesOut, ...waysOut, ...relationsOut3];
};

// on CZ 48,11,51,19 makes 12 MB   (only crags is 700kB)
export const fetchCrags = async () => {
  const tile = await fetchJson('/api/climbing-tiles/tile', { nocache: true });
  publishDbgObject('fetchCrags', tile);
  return {
    type: 'FeatureCollection',
    features: tile,
  } as GeoJSON.FeatureCollection;

  const query = `[out:json][timeout:25];
    (
      nwr["climbing"](49.64474,14.21855,49.67273,14.28025);
      >;<;
      rel["climbing"="crag"];
      rel["climbing"="area"];
    );
    (
      ._;
      rel(br);
    );
    out center qt;
  `;
  const data = encodeURIComponent(query);
  const url = `https://overpass-api.de/api/interpreter?data=${data}`;
  const overpass = await fetchJson(url);
  const features = cragsToGeojson(overpass);

  const relationPoints = features
    .filter((f) => f.osmMeta.type === 'relation' && f.center)
    .map((element) => ({
      ...element,
      geometry: {
        type: 'Point',
        coordinates:
          element.properties.climbing === 'area'
            ? element.center.map((c) => c + 0.00007) // area with single crag displaced ~10m
            : element.center,
      },
      properties: {
        ...element.properties,
        osmappType: 'relationPoint',
      },
    }));

  const featuresWithRelationPoints = [...features, ...relationPoints];
  publishDbgObject('fetchCrags', featuresWithRelationPoints);

  return {
    type: 'FeatureCollection',
    features: featuresWithRelationPoints,
  } as GeoJSON.FeatureCollection;
};
