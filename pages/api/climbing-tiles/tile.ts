import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getClimbingTile,
  TileNumber,
} from '../../../src/server/climbing-tiles/getClimbingTile';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const tileNumber: TileNumber = [
      Number(req.query.z),
      Number(req.query.x),
      Number(req.query.y),
    ];

    const geojson = await getClimbingTile(tileNumber);
    res.setHeader('Content-Type', 'application/json').status(200).send(geojson);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
