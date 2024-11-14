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
import { LineString, LonLat, Point } from '../../services/types';
import * as fs from 'node:fs';

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

type Records = Partial<EditableData<ClimbingTilesRecord>>[];

const recordsFactory = () => {
  const records: Records = [];
  const addRecordRaw = (
    type: string,
    coordinates: LonLat,
    feature: GeojsonFeature,
  ) =>
    records.push({
      type,
      osmType: feature.osmMeta.type,
      osmId: feature.osmMeta.id,
      name: feature.tags.name,
      count: feature.properties.osmappRouteCount,
      lon: coordinates[0],
      lat: coordinates[1],
      geojson: prepareGeojson(type, feature),
    });

  const addRecord = (type: string, feature: GeojsonFeature<Point>) => {
    addRecordRaw(type, feature.geometry.coordinates, feature);
  };

  const addRecordWithLine = (type: string, way: GeojsonFeature<LineString>) => {
    addRecord(type, firstPointGeometry(way));
    addRecordRaw(type, way.center, way);
  };

  return { records, addRecord, addRecordWithLine };
};

const getNewRecords = async (data: OsmResponse) => {
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

export const refresh = async (writeCallback: (line: string) => void) => {
  const start = performance.now();
  writeCallback('Deleting old records...');
  await xata.sql`DELETE FROM climbing_tiles`;

  writeCallback('Fetching data from Overpass...');
  //const data = await fetchFromOverpass();
  //fs.writeFileSync('../overpass.json', JSON.stringify(data));
  const data = JSON.parse(
    fs.readFileSync('../overpass.json').toString(),
  ) as OsmResponse;

  console.log('Data:', data.elements.length);

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
