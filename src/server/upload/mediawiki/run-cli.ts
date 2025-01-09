import { getMediaWikiSession } from './mediawiki';
import { readFile } from 'node:fs/promises';
import { isTitleAvailable } from './isTitleAvailable';

// run with:
//   npx tsx run-cli.ts

(async () => {
  const password = (await readFile('../../../../.env.local', 'utf-8'))
    .split('\n')[0]
    .split('=')[1];

  const session = getMediaWikiSession();
  console.log(await session.login('OsmappBot@osmapp-upload', password)); // eslint-disable-line no-console

  isTitleAvailable('File:Hrana_(Climbing_crag)_-_OsmAPP.jpg').then(console.log); // eslint-disable-line no-console
})();
