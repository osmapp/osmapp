import { xata } from '../db/db';

export const climbingTile = async () => {
  const start = performance.now();
  const alldata = await xata.db.climbing_tiles
    .filter({
      // type: '_otherWays',
      lat: { $gt: 48, $lt: 51 },
      lon: { $gt: 14, $lt: 19 },
    })
    .getAll();

  console.log('climbingTile', performance.now() - start);

  return alldata.map((record) => record.geojson);
};
