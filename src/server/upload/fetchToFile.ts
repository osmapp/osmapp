import { Readable } from 'stream';
import fs from 'node:fs';
import { finished } from 'stream/promises';

export const fetchToFile = async (url: string) => {
  const filepath = `/tmp/${Math.random()}`;
  const response = await fetch(url);
  const inStream = Readable.fromWeb(response.body as unknown as any);
  const outStream = fs.createWriteStream(filepath);
  await finished(inStream.pipe(outStream));

  return filepath;
};
