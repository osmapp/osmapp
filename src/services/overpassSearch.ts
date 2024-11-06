import { LineString, OsmId, Point, GeometryCollection } from './types';
import { getPoiClass } from './getPoiClass';
import { getCenter } from './getCenter';
import { fetchJson } from './fetch';
import { Feature, FeatureCollection, Polygon } from 'geojson';
import { ASTNode } from '../components/SearchBox/queryWizard/ast';
import { Bbox } from '../components/utils/MapStateContext';
import { generateQuery } from '../components/SearchBox/queryWizard/generateQuery';
import { isAstNode } from '../components/SearchBox/queryWizard/isAst';

const getOverpassQuery = ([a, b, c, d], query: string) =>
  `[out:json][timeout:25][bbox:${[d, a, b, c]}];(${query};);out geom qt;`;

export const getOverpassUrl = (fullQuery: string) =>
  `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
    fullQuery,
  )}`;

type OverpassObject = {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
  bounds?: {
    minlat: number;
    minlon: number;
    maxlat: number;
    maxlon: number;
  };
  nodes?: number[];
  geometry?: {
    lon: number;
    lat: number;
  }[];
  members?: any[];
};

const geojsonCoords = ({ geometry }: OverpassObject): [number, number][] =>
  geometry.map(({ lon, lat }) => [lon, lat]);

const GEOMETRY = {
  node: ({ lat, lon }: OverpassObject): Point => ({
    type: 'Point',
    coordinates: [lon, lat],
  }),

  way: (element: OverpassObject): LineString | Polygon => {
    if (isClosedWay(element)) {
      return {
        type: 'Polygon',
        coordinates: [geojsonCoords(element)],
      };
    }

    return {
      type: 'LineString',
      coordinates: geojsonCoords(element),
    };
  },

  relation: ({
    members,
    tags = {},
  }: OverpassObject): GeometryCollection | Polygon => {
    if (tags.type === 'multipolygon') {
      const outer = members
        .filter(({ role }) => role === 'outer')
        .flatMap(geojsonCoords);

      const inner = members
        .filter(({ role }) => role === 'inner')
        .map(geojsonCoords);

      return {
        type: 'Polygon',
        coordinates: [[...outer], ...inner],
      };
    }

    return {
      type: 'GeometryCollection',
      geometries:
        members
          ?.map((el) =>
            el.type === 'node'
              ? GEOMETRY.node(el)
              : el.type === 'way'
                ? GEOMETRY.way(el)
                : null,
          )
          .filter(Boolean) ?? [],
    };
  },
};

const convertOsmIdToMapId = (apiId: OsmId) => {
  const osmToMapType = { node: 0, way: 1, relation: 4 };
  return parseInt(`${apiId.id}${osmToMapType[apiId.type]}`, 10);
};

const isClosedWay = (element: OverpassObject) => {
  const nodes = element.geometry;
  if (nodes.length < 4) {
    return false;
  }

  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  return first.lat === last.lat && first.lon === last.lon;
};

type OverpassFeature = Feature & {
  tags: Record<string, string>;
};

// TODO use our own implementaion from fetchCrags, which handles recursive geometries
export const overpassGeomToGeojson = (response: {
  elements: OverpassObject[];
}): OverpassFeature[] =>
  response.elements.map((element) => {
    const { type, id, tags = {} } = element;
    const geometry = GEOMETRY[type]?.(element);
    return {
      type: 'Feature',
      id: convertOsmIdToMapId({ type, id }),
      osmMeta: { type, id },
      tags,
      properties: { ...getPoiClass(tags), ...tags, osmappType: type },
      geometry,
      center: getCenter(geometry) ?? undefined,
    };
  });

const getQueryBody = (
  astOrTagsOrQuery: ASTNode | Record<string, string> | string,
) => {
  if (typeof astOrTagsOrQuery === 'string') {
    return astOrTagsOrQuery;
  }

  if (!isAstNode(astOrTagsOrQuery)) {
    const tags = Object.entries(astOrTagsOrQuery);
    const selector = tags
      .map(([k, v]) => (v === '*' ? `["${k}"]` : `["${k}"="${v}"]`))
      .join('');
    return `nwr${selector}`;
  }

  return generateQuery(astOrTagsOrQuery);
};

export const performOverpassSearch = async (
  bbox: Bbox,
  astOrTagsOrQuery: ASTNode | Record<string, string> | string,
): Promise<FeatureCollection> => {
  const body = getQueryBody(astOrTagsOrQuery);
  const query = getOverpassQuery(bbox, body);

  console.log('seaching overpass for query: ', query); // eslint-disable-line no-console
  const overpass = await fetchJson(getOverpassUrl(query));
  console.log('overpass result:', overpass); // eslint-disable-line no-console

  const features = overpassGeomToGeojson(overpass);
  console.log('overpass geojson', features); // eslint-disable-line no-console

  return { type: 'FeatureCollection', features };
};
