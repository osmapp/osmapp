import { xata } from '../db/db';
import { Client } from 'pg';

export const climbingTile = async () => {
  const start = performance.now();
  const alldata = await xata.db.climbing_tiles
    .select(['geojson'])
    .filter({
      // type: '_otherWays',
      // lat: { $gt: 48, $lt: 51 },
      // lon: { $gt: 14, $lt: 19 },
      type: 'group',
      geohash: 'u2',
    })
    .getAll();

  console.log('climbingTileXata', performance.now() - start, alldata.length);

  return alldata.map((record) => record.geojson);
};

export const climbingTilePg = async () => {
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

  const result = await client.query(
    "SELECT geojson FROM climbing_tiles WHERE type='group' AND geohash = 'u2'",
  );

  console.log('climbingTilePg', performance.now() - start, result.rows.length);

  return result.rows.map((record) => record.geojson);
};
