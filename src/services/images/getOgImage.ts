import { fetchText } from '../fetch';

const protocol = /^\w+:\/\//;
const fixHttp = (url) => (url.match(protocol) ? url : `http://${url}`);

export const getOgImage = async (website: string) => {
  const url = fixHttp(website);

  // TODO in browser we need a proxy to avoid CORS
  const html = await fetchText(url);
  const content = html.match(/<meta property="og:image" content="([^"]+)"/);

  if (content) {
    return {
      source: `${website} og:image`,
      link: url,
      thumb: content[1],
      portrait: true,
    };
  }
  return undefined;
};
