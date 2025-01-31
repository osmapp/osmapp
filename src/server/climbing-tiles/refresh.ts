import {
  GeojsonFeature,
  OsmResponse,
  overpassToGeojsons,
} from './overpass/overpassToGeojsons';
import { encodeUrl } from '../../helpers/utils';
import { fetchJson } from '../../services/fetch';
import { LineString, LonLat, Point } from '../../services/types';
import { Client } from 'pg';
import format from 'pg-format';
// import { encodeBase32, decodeBase32 } from 'geohashing';

const centerGeometry = (feature: GeojsonFeature): GeojsonFeature<Point> => ({
  ...feature,
  geometry: {
    type: 'Point',
    coordinates: feature.center,
  },
});

const firstPointGeometry = (
  feature: GeojsonFeature<LineString>,
): GeojsonFeature<Point> => ({
  ...feature,
  geometry: {
    type: 'Point',
    coordinates: feature.geometry.coordinates[0],
  },
});

const prepareGeojson = (
  type: string,
  { id, geometry, properties }: GeojsonFeature,
) =>
  JSON.stringify({
    type: 'Feature',
    id,
    geometry,
    properties: { ...properties, type },
  });

const fetchFromOverpass = async () => {
  // takes about 42 secs, 25MB
  const query = `[out:json][timeout:80];(nwr["climbing"];nwr["sport"="climbing"];);>>;out qt;`;
  const data = await fetchJson<OsmResponse>(
    'https://overpass-api.de/api/interpreter',
    {
      body: encodeUrl`data=${query}`,
      method: 'POST',
      nocache: true,
    },
  );

  if (data.elements.length < 1000) {
    throw new Error(
      `Overpass returned too few elements. Data:${JSON.stringify(data).substring(0, 200)}`,
    );
  }

  return data;
};

type Records = any; //Partial<EditableData<ClimbingTilesRecord>>[];

const recordsFactory = () => {
  const records: Records = [];
  const addRecordRaw = (
    type: string,
    coordinates: LonLat,
    feature: GeojsonFeature,
  ) => {
    const lon = coordinates[0];
    const lat = coordinates[1];
    return records.push({
      type,
      osmType: feature.osmMeta.type,
      osmId: feature.osmMeta.id,
      name: feature.tags.name,
      count: feature.properties.osmappRouteCount || 0,
      lon,
      lat,
      // geohash: encodeBase32(lat, lon, 2),
      geojson: prepareGeojson(type, feature),
    });
  };

  const addRecord = (type: string, feature: GeojsonFeature<Point>) => {
    addRecordRaw(type, feature.geometry.coordinates, feature);
  };

  const addRecordWithLine = (type: string, way: GeojsonFeature<LineString>) => {
    addRecord(type, firstPointGeometry(way));
    addRecordRaw(type, way.center, way);
  };

  return { records, addRecord, addRecordWithLine };
};

const getNewRecords = (data: OsmResponse) => {
  const geojsons = overpassToGeojsons(data); // 700 ms on 16k items
  const { records, addRecord, addRecordWithLine } = recordsFactory();

  for (const node of geojsons.node) {
    if (!node.tags) continue;
    if (
      node.tags.climbing === 'area' ||
      node.tags.climbing === 'boulder' ||
      node.tags.climbing === 'crag' ||
      node.tags.natural === 'peak'
    ) {
      addRecord('group', node);
    }

    //
    else if (
      node.tags.climbing === 'route' ||
      node.tags.climbing === 'route_bottom'
    ) {
      addRecord('route', node);
    }

    //
    else if (node.tags.climbing === 'route_top') {
      // later + update climbingLayer
    }

    // 120 k nodes ???
    else {
      //addRecord('_otherNodes', node);
    }
  }

  for (const way of geojsons.way) {
    // climbing=route -> route + line
    // highway=via_ferrata -> route + line
    if (way.tags.climbing === 'route' || way.tags.highway === 'via_ferrata') {
      addRecordWithLine('route', way);
    }

    // natural=cliff + sport=climbing -> group
    // natural=rock + sport=climbing -> group
    else if (
      way.tags.sport === 'climbing' &&
      (way.tags.natural === 'cliff' || way.tags.natural === 'rock')
    ) {
      addRecord('group', centerGeometry(way));
    }

    // _otherWays to debug
    else {
      addRecord('_otherWays', centerGeometry(way));
      // TODO way/167416816 is natural=cliff with parent relation type=site
    }
  }

  for (const relation of geojsons.relation) {
    // climbing=area -> group
    // climbing=boulder -> group
    // climbing=crag -> group
    // climbing=route -> group // multipitch or via_ferrata
    // type=site -> group
    // type=multipolygon -> group + delete nodes
    if (
      relation.tags.climbing === 'area' ||
      relation.tags.type === 'boulder' ||
      relation.tags.type === 'crag' ||
      relation.tags.climbing === 'route' ||
      relation.tags.type === 'site' ||
      relation.tags.type === 'multipolygon'
    ) {
      addRecord('group', centerGeometry(relation));
    }

    // _otherRelations to debug
    else {
      addRecord('group', centerGeometry(relation));
    }

    // TODO no center -> write to log
  }

  return records;
};

export const refresh = async (log: (line: string) => void) => {
  const client = new Client({
    user: 'tvgiad',
    password: 'xau_E0h76BAWwiiGCOqEYZsRoCUQqXEQ3jpM',
    host: 'us-east-1.sql.xata.sh',
    port: 5432,
    database: 'db_with_direct_access:main',
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  const start = performance.now();

  log('Fetching data from Overpass...');
  const data = await fetchFromOverpass();
  // fs.writeFileSync('../overpass.json', JSON.stringify(data));
  // const data = JSON.parse(
  //   fs.readFileSync('../overpass.json').toString(),
  // ) as OsmResponse;
  log(`Overpass elements: ${data.elements.length}`);

  const records = getNewRecords(data); // ~ 16k records
  log(`Records: ${records.length}`);

  const columns = Object.keys(records[0]);
  const values = records.map((record) => Object.values(record));
  const query = format(
    `TRUNCATE TABLE climbing_tiles;
      INSERT INTO climbing_tiles(%I) VALUES %L;
      TRUNCATE TABLE tiles_cache;`,
    columns,
    values,
  );
  log(`SQL Query length: ${query.length} chars`);

  await client.query(query);
  await client.end();

  log('Done.');
  log(`Duration: ${Math.round(performance.now() - start)} ms`);
};
