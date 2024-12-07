import { Client } from 'pg';
import vtpbf from 'vt-pbf';
import geojsonVt from 'geojson-vt';
import * as tilebelt from '@mapbox/tilebelt';

export type TileNumber = [number, number, number];

const fetchFromDb = async ([z, x, y]: TileNumber) => {
  const start = performance.now();

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

  const bbox = tilebelt.tileToBBOX([z, x, y]);

  const query =
    z < 12
      ? `SELECT geojson FROM climbing_tiles WHERE type='group' AND lon >= ${bbox[0]} AND lon <= ${bbox[2]} AND lat >= ${bbox[1]} AND lat <= ${bbox[3]}`
      : `SELECT geojson FROM climbing_tiles WHERE type IN ('group', 'route') AND lon >= ${bbox[0]} AND lon <= ${bbox[2]} AND lat >= ${bbox[1]} AND lat <= ${bbox[3]}`;
  const result = await client.query(query);
  const geojson = {
    type: 'FeatureCollection',
    features: result.rows.map((record) => record.geojson),
  } as GeoJSON.FeatureCollection;

  console.log('climbingTilePg', performance.now() - start, result.rows.length);

  return geojson;
};

export const climbingTile = async ([z, x, y]: TileNumber) => {
  const orig = await fetchFromDb([z, x, y]);
  const tileindex = geojsonVt(orig, {});
  const tile = tileindex.getTile(z, x, y);

  return vtpbf.fromGeojsonVt({ groups: tile });
};
