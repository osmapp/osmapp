// import {encodeUrl} from "@/utils";
// import * as fs from "node:fs/promises";
// const query = `[out:json][timeout:80];(nwr["climbing"];nwr["sport"="climbing"];);>>;out qt;`;
// const res = await fetch("https://overpass-api.de/api/interpreter", {
//     "body": encodeUrl`data=${query}`,
//     "method": "POST"
// });
// const data = await res.json();
// fs.writeFile("data.json", JSON.stringify(data, null, 2));

import { xata } from '../db/db';
import {
  GeojsonFeature,
  overpassToGeojsons,
} from './overpass/overpassToGeojsons';
import * as fs from 'fs/promises';
import { chunk } from 'lodash';
import { EditableData, TransactionOperation } from '@xata.io/client';
import { ClimbingTilesRecord, DatabaseSchema } from '../db/xata-generated';

export const geometryToPoint = (feature: GeojsonFeature): GeojsonFeature => ({
  ...feature,
  geometry: {
    type: 'Point',
    coordinates: feature.center,
  },
});

const prepareGeojson = ({ id, geometry, properties }: GeojsonFeature) =>
  JSON.stringify({
    type: 'Feature',
    id,
    geometry,
    properties,
  });

const getNewRecords = async () => {
  const file = await fs.readFile('data3_42s_25mb.json', 'utf8');
  const data = JSON.parse(file); // 200 ms
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
        geojson: prepareGeojson(node),
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
        geojson: prepareGeojson(node),
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
        geojson: prepareGeojson({
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
        geojson: prepareGeojson(geometryToPoint(way)),
      });
    }
  }

  for (const relation of geojsons.relation) {
    records.push({
      type: 'group',
      osmType: 'relation',
      osmId: relation.osmMeta.id,
      lon: relation.center[0],
      lat: relation.center[1],
      name: relation.tags.name,
      count: relation.properties.osmappRouteCount,
      geojson: prepareGeojson(geometryToPoint(relation)),
    });
  }

  return records;
};

export const refresh = async () => {
  const start = performance.now();
  await xata.sql`DELETE FROM climbing_tiles`;

  const records = await getNewRecords(); // ~ 16k records
  const chunks = chunk(records, 1000);
  for (const chunk of chunks) {
    await xata.transactions.run(
      // avg 700kb per 1000 records, takes ~5 secs
      chunk.map(
        (record) =>
          ({
            insert: { table: 'climbing_tiles', record },
          }) as TransactionOperation<DatabaseSchema, 'climbing_tiles'>,
      ),
    );
  }

  return {
    createdRecords: records.length,
    durationMs: Math.round(performance.now() - start), // total 69 seconds
    sizeKb: Math.round(JSON.stringify(records).length / 1000),
  };
};

// all 8 secs
export const climbingTile = async () => {
  const start = performance.now();
  const alldata = await xata.db.climbing_tiles
    .filter({
      type: 'group',
    })
    .getAll();
  // .getMany({
  //   pagination: { size: 1000, offset: 0 },
  // });

  console.log('climbingTile', performance.now() - start);

  return alldata.map((record) => ({
    ...record.geojson,
    properties: {
      ...record.geojson.properties,
      type: record.type,
    },
  }));
};
