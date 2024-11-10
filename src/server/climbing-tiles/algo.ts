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
import { overpassToGeojsons } from './overpass/overpassToGeojsons';

type OsmType = 'node' | 'way' | 'relation';
type OsmNode = {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
};
type OsmWay = {
  type: 'way';
  id: number;
  nodes: number[];
  tags: Record<string, string>;
};
type OsmRelation = {
  type: 'relation';
  id: number;
  members: {
    type: OsmType;
    ref: number;
    role: string;
  }[];
  tags: Record<string, string>;
};
type OsmItem = OsmNode | OsmWay | OsmRelation;

const elements: OsmItem[] = [
  // {
  //     "type": "node",
  //     "id": 313822575,
  //     "lat": 50.0547464,
  //     "lon": 14.4056821,
  //     "tags": {
  //         "climbing:boulder": "yes",
  //         "climbing:toprope": "yes",
  //         "leisure": "sports_centre",
  //         "name": "SmíchOFF",
  //         "opening_hours": "Mo 07:00-23:00; Tu-Th 07:00-23:30; Fr 07:00-23:00; Sa,Su 08:00-23:00",
  //         "sport": "climbing",
  //         "website": "https://www.lezeckecentrum.cz/"
  //     }
  // },
  {
    type: 'node',
    id: 11580052710,
    lat: 49.6600391,
    lon: 14.2573987,
    tags: {
      climbing: 'route_bottom',
      'climbing:grade:uiaa': '9-',
      name: 'Lída',
      sport: 'climbing',
      wikimedia_commons: 'File:Roviště - Hafty2.jpg',
      'wikimedia_commons:2': 'File:Roviště - Hafty3.jpg',
      'wikimedia_commons:2:path':
        '0.273,0.904|0.229,0.566B|0.317,0.427B|0.433,0.329B|0.515,0.21B|0.526,0.126B|0.495,0.075A',
      'wikimedia_commons:path':
        '0.67,0.601|0.66,0.442B|0.682,0.336B|0.739,0.236B|0.733,0.16B|0.72,0.1B|0.688,0.054A',
    },
  },
  {
    type: 'relation',
    id: 17130663,
    members: [
      {
        type: 'node',
        ref: 11580052710,
        role: '',
      },
    ],
    tags: {
      climbing: 'crag',
      name: 'Yosemite (Hafty)',
      site: 'climbing',
      sport: 'climbing',
      type: 'site',
      wikimedia_commons: 'File:Roviště - Hafty.jpg',
      'wikimedia_commons:10': 'File:Roviště - Hafty10.jpg',
      'wikimedia_commons:2': 'File:Roviště - Hafty2.jpg',
      'wikimedia_commons:3': 'File:Roviště - Hafty3.jpg',
      'wikimedia_commons:4': 'File:Roviště - Hafty4.jpg',
      'wikimedia_commons:5': 'File:Roviště - Hafty5.jpg',
      'wikimedia_commons:6': 'File:Roviště - Hafty6.jpg',
      'wikimedia_commons:7': 'File:Roviště - Hafty7.jpg',
      'wikimedia_commons:8': 'File:Roviště - Hafty8.jpg',
      'wikimedia_commons:9': 'File:Roviště - Hafty9.jpg',
    },
  },
  {
    type: 'relation',
    id: 17130099,
    members: [
      {
        type: 'relation',
        ref: 17130663,
        role: '',
      },
    ],
    tags: {
      climbing: 'area',
      description:
        'Roviště je klasická vltavská žula. Jedná se o velmi vyhlášenou oblast. Nabízí cesty prakticky všech obtížností, zpravidla dobře odjištěné.',
      name: 'Roviště',
      site: 'climbing',
      type: 'site',
      website: 'https://www.horosvaz.cz/skaly-sektor-289/',
      'website:2': 'https://www.lezec.cz/pruvodcx.php?key=5',
    },
  },

  // two nodes and a climbing=route way
  {
    type: 'node',
    id: 1,
    lat: 50,
    lon: 14,
    tags: {},
  },
  {
    type: 'node',
    id: 2,
    lat: 51,
    lon: 15,
    tags: {},
  },
  {
    type: 'way',
    id: 3,
    nodes: [1, 2],
    tags: {
      climbing: 'route',
      name: 'Route of type way starting on 14,50',
    },
  },

  // two nodes and natural=cliff way ("crag")
  {
    type: 'node',
    id: 4,
    lat: 52,
    lon: 16,
    tags: {},
  },
  {
    type: 'node',
    id: 5,
    lat: 53,
    lon: 17,
    tags: {},
  },
  {
    type: 'way',
    id: 6,
    nodes: [4, 5],
    tags: {
      natural: 'cliff',
      name: 'Cliff of type way at 16.5,52.5',
    },
  },
];

import * as fs from 'fs/promises';

export const fetchAll = async () => {
  const file = await fs.readFile('data3_42s_25mb.json', 'utf8');
  const data = JSON.parse(file); // 200 ms

  const start0 = performance.now();
  const geojsons = overpassToGeojsons(data);
  const start1 = performance.now();
  console.log('overpassToGeojsons', start1 - start0);

  // TODO start postgre transaction ??

  await xata.sql`DELETE FROM climbing_tiles`;
  const start2 = performance.now();
  console.log('delete', start2 - start1);

  for (const node of geojsons.node) {
    if (node.tags?.climbing === 'route_bottom') {
      await xata.db.climbing_tiles.create({
        type: 'route',
        osmType: 'node',
        osmId: node.osmMeta.id,
        lon: node.geometry.coordinates[0],
        lat: node.geometry.coordinates[1],
        name: node.tags.name,
        json: node,
      });
    }
    if (node.tags?.climbing === 'crag') {
      await xata.db.climbing_tiles.create({
        type: 'group',
        osmType: 'node',
        osmId: node.osmMeta.id,
        lon: node.geometry.coordinates[0],
        lat: node.geometry.coordinates[1],
        name: node.tags.name,
        count: node.properties.osmappRouteCount,
        json: node,
      });
    }
  }
  const start3 = performance.now();
  console.log('node', start3 - start2);

  for (const way of geojsons.way) {
    if (way.tags.climbing === 'route') {
      const start = way.geometry.coordinates[0];
      await xata.db.climbing_tiles.create({
        type: 'route',
        osmType: 'way',
        osmId: way.osmMeta.id,
        lon: start[0],
        lat: start[1],
        name: way.tags.name,
        json: { ...way, geometry: { type: 'Point', coordinates: start } },
      });
    } else {
      await xata.db.climbing_tiles.create({
        type: 'group',
        osmType: 'way',
        osmId: way.osmMeta.id,
        lon: way.center[0],
        lat: way.center[1],
        name: way.tags.name,
        count: way.properties.osmappRouteCount,
        json: way,
      });
    }
  }
  const start4 = performance.now();
  console.log('way', start4 - start3);

  for (const relation of geojsons.relation) {
    await xata.db.climbing_tiles.create({
      type: 'group',
      osmType: 'relation',
      osmId: relation.osmMeta.id,
      lon: relation.center[0],
      lat: relation.center[1],
      name: relation.tags.name,
      count: relation.properties.osmappRouteCount,
      json: relation,
    });
  }
  const start5 = performance.now();
  console.log('relation', start5 - start4);
  console.log('fetchAll', start5 - start0);

  return [];
};
