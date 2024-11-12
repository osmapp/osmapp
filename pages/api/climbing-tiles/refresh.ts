import type { NextApiRequest, NextApiResponse } from 'next';
import { climbingTile } from '../../../src/server/climbing-tiles/climbing-tile';
import { refresh } from '../../../src/server/climbing-tiles/refresh';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    res.writeHead(200, {
      Connection: 'keep-alive',
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    });

    const writeCallback = (line: string) => {
      console.log(line); // eslint-disable-line no-console
      res.write(line + '\n');
    };

    await refresh(writeCallback);

    res.end();
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
