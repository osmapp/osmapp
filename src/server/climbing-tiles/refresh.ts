import {
  GeojsonFeature,
  OsmResponse,
  overpassToGeojsons,
} from './overpass/overpassToGeojsons';
import { xata } from '../db/db';
import { chunk } from 'lodash';
import { EditableData, TransactionOperation } from '@xata.io/client';
import { ClimbingTilesRecord, DatabaseSchema } from '../db/xata-generated';
import { encodeUrl } from '../../helpers/utils';
import { fetchJson } from '../../services/fetch';

export const centerGeometry = (feature: GeojsonFeature): GeojsonFeature => ({
  ...feature,
  geometry: {
    type: 'Point',
    coordinates: feature.center,
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

const getNewRecords = async (data: OsmResponse) => {
  const geojsons = overpassToGeojsons(data); // 700 ms

  const records: Partial<EditableData<ClimbingTilesRecord>>[] = [];

  for (const node of geojsons.node) {
    if (node.tags?.climbing === 'route_bottom') {
      records.push({
        type: 'route',
        osmType: 'node',
        osmId: node.osmMeta.id,
        lon: node.geometry.coordinates[0],
        lat: node.geometry.coordinates[1],
        name: node.tags.name,
        geojson: prepareGeojson('route', node),
      });
    }
    if (node.tags?.climbing === 'crag') {
      records.push({
        type: 'group',
        osmType: 'node',
        osmId: node.osmMeta.id,
        lon: node.geometry.coordinates[0],
        lat: node.geometry.coordinates[1],
        name: node.tags.name,
        count: node.properties.osmappRouteCount,
        geojson: prepareGeojson('group', node),
      });
    }
  }

  for (const way of geojsons.way) {
    if (way.tags.climbing === 'route') {
      const start = way.geometry.coordinates[0];
      records.push({
        type: 'route',
        osmType: 'way',
        osmId: way.osmMeta.id,
        lon: start[0],
        lat: start[1],
        name: way.tags.name,
        geojson: prepareGeojson('route', {
          ...way,
          geometry: { type: 'Point', coordinates: start },
        }),
      });
    } else {
      records.push({
        type: 'group',
        osmType: 'way',
        osmId: way.osmMeta.id,
        lon: way.center[0],
        lat: way.center[1],
        name: way.tags.name,
        count: way.properties.osmappRouteCount,
        geojson: prepareGeojson('group', centerGeometry(way)),
      });
    }
  }

  for (const relation of geojsons.relation) {
    if (relation.tags.climbing === 'route') {
      records.push({
        type: 'route',
        osmType: 'relation',
        osmId: relation.osmMeta.id,
        lon: relation.center[0], // TODO maybe use first point in future
        lat: relation.center[1],
        name: relation.tags.name,
        count: relation.properties.osmappRouteCount,
        geojson: prepareGeojson('route', centerGeometry(relation)),
      });
    } else {
      records.push({
        type: 'group',
        osmType: 'relation',
        osmId: relation.osmMeta.id,
        lon: relation.center[0],
        lat: relation.center[1],
        name: relation.tags.name,
        count: relation.properties.osmappRouteCount,
        geojson: prepareGeojson('group', centerGeometry(relation)),
      });
    }
  }

  return records;
};

export const refresh = async (writeCallback: (line: string) => void) => {
  const start = performance.now();
  writeCallback('Deleting old records...');
  await xata.sql`DELETE FROM climbing_tiles`;

  writeCallback('Fetching data from Overpass...');
  const data = await fetchFromOverpass();
  const records = await getNewRecords(data); // ~ 16k records

  writeCallback(`Inserting new records (${records.length})...`);
  const chunks = chunk(records, 1000);
  for (const chunk of chunks) {
    await xata.transactions.run(
      // avg takes ~5 secs
      chunk.map(
        (record) =>
          ({
            insert: { table: 'climbing_tiles', record },
          }) as TransactionOperation<DatabaseSchema, 'climbing_tiles'>,
      ),
    );
    writeCallback(`Inserted ${chunk.length} records.`);
  }

  writeCallback('Done.');
  writeCallback(`Created records: ${records.length}`);
  writeCallback(`Duration: ${Math.round(performance.now() - start)} ms`);
  writeCallback(`Records size: ${JSON.stringify(records).length} bytes`);
};
