import { xata } from '../db/db';

export const climbingTile = async () => {
  const start = performance.now();
  const alldata = await xata.db.climbing_tiles
    .filter({
      type: 'group',
    })
    .getAll();

  console.log('climbingTile', performance.now() - start);

  return alldata.map((record) => record.geojson);
};
