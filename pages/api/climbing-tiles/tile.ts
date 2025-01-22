import type { NextApiRequest, NextApiResponse } from 'next';
import {
  climbingTile,
  TileNumber,
} from '../../../src/server/climbing-tiles/climbing-tile';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const tileNumber = [req.query.z, req.query.x, req.query.y].map(
      Number,
    ) as TileNumber;

    const buffer = await climbingTile(tileNumber, req.query.type as string);
    res
      .setHeader('Content-Type', 'application/x-protobuf')
      .status(200)
      .end(buffer);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
