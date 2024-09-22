import { encodeUrl } from '../../helpers/utils';
import { fetchJson } from '../fetch';
import { ImageDef, isCenter, isInstant, isTag } from '../types';

import { getCommonsImageUrl } from './getCommonsImageUrl';
import { getFodyImage } from './getFodyImage';
import { getInstantImage, ImageType, WIDTH } from './getImageDefs';
import { getMapillaryImage } from './getMapillaryImage';

type ImagePromise = Promise<ImageType[]>;

const getCommonsFileApiUrl = (title: string) =>
  encodeUrl`https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&iiurlwidth=${
    WIDTH
  }&format=json&titles=${title}&origin=*`;

const fetchCommonsFile = async (k: string, v: string): ImagePromise => {
  const url = getCommonsFileApiUrl(v);
  const data = await fetchJson(url);
  const page = Object.values(data.query.pages)[0] as any;
  if (!page.imageinfo?.length) {
    return [];
  }
  const image = page.imageinfo[0];
  return [
    {
      imageUrl: decodeURI(image.thumburl),
      description: `Wikimedia Commons (${k}=*)`,
      link: page.title,
      linkUrl: image.descriptionshorturl,
      // portrait: images[0].thumbwidth < images[0].thumbheight,
    },
  ];
};

const isAudioUrl = (url: string) =>
  url.endsWith('.ogg') || url.endsWith('.mp3') || url.endsWith('.wav');

const getCommonsCategoryApiUrl = (title: string) =>
  encodeUrl`https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=${
    title
  }&gcmlimit=10&gcmtype=file&prop=imageinfo&iiprop=url&iiurlwidth=${
    WIDTH
  }&format=json&origin=*`;

const fetchCommonsCategory = async (k: string, v: string): ImagePromise => {
  const url = getCommonsCategoryApiUrl(v);
  const data = await fetchJson(url);
  const pages = Object.values(data.query.pages);
  const imageInfos = pages
    .map((page: any) => page.imageinfo?.at(0))
    .filter((x) => x !== undefined)
    .filter(({ url }) => !isAudioUrl(url));
  const thumbs = imageInfos.map(({ thumburl }) => thumburl);

  return thumbs.map((thumburl) => ({
    imageUrl: decodeURI(thumburl),
    description: `Wikimedia Commons category (${k}=*)`,
    link: v,
    linkUrl: `https://commons.wikimedia.org/wiki/${v}`,
    // portrait: images[0].thumbwidth < images[0].thumbheight,
  }));
};

const getWikidataApiUrl = (entity: string) =>
  encodeUrl`https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&format=json&entity=${
    entity
  }&origin=*`;

const fetchWikidata = async (entity: string): ImagePromise => {
  const url = getWikidataApiUrl(entity);
  const data = await fetchJson(url);

  if (!data.claims?.P18) {
    return [];
  }

  const imagesP18 = data.claims.P18;
  const candidates =
    imagesP18.length > 1
      ? imagesP18.filter(({ rank }) => rank !== 'deprecated')
      : [];
  const entry = candidates.length > 0 ? candidates[0] : imagesP18[0];
  const file = `File:${entry.mainsnak.datavalue.value}`;
  return [
    {
      imageUrl: decodeURI(getCommonsImageUrl(file, WIDTH)),
      description: 'Wikidata image (wikidata=*)',
      link: entity,
      linkUrl: `https://www.wikidata.org/wiki/${entity}`,
    },
  ];
};

const parseWikipedia = (k: string, v: string) => {
  if (v.includes(':')) {
    const parts = v.split(':', 2);
    return { country: parts[0], title: parts[1] };
  }
  if (k.match(/:[a-z]{2}(-[a-z]{2})?$/i)) {
    // TODO only wiki languages?
    return { country: k.split(':', 2)[1], title: v };
  }
  return { country: 'en', title: v };
};

const isAllowedWikipedia = (title: string) => {
  const forbiddenPatterns = [
    /File:Commons-logo\.svg/,
    /File:Compass rose pale\.svg/,
    /File:Arrleft\.svg/,
    /File:Arrright\.svg/,
    /File:Info Simple\.svg/,
    /File:Blue pencil\.svg/,
    /File:Fairytale warning\.png/,
    /File:([A-Z][a-z]*)( transit icons -)? (S|U)\d{1,2}(-20\d{2})?\.svg/,
    /File:BSicon (.*)?\.svg/,
    /File:Deutsche Bahn AG-Logo\.svg/,
    /File:S-Bahn-Logo\.svg/,
    /File:Airplane silhouette\.svg/,
    /File:(.*) Audiologo\.ogg/,
    /File:Bundes(straße|autobahn) \d+ number\.svg/,
  ];
  return !forbiddenPatterns.some((pattern) => pattern.test(title));
};

const getWikipediaApiUrl = (country: string, title: string) =>
  encodeUrl`https://${
    country
  }.wikipedia.org/w/api.php?action=query&prop=images&titles=${title}&format=json&origin=*`;

const fetchWikipedia = async (k: string, v: string): ImagePromise => {
  const { country, title } = parseWikipedia(k, v);
  const url = getWikipediaApiUrl(country, title);
  const data = await fetchJson(url);
  const page = Object.values(data.query.pages)[0] as any;
  const imagesTitles = (page.images as { title: string }[]).map(({ title }) => {
    const [_, name] = title.split(':', 2);
    return `File:${name}`;
  });

  const promiseImages = imagesTitles
    .filter(isAllowedWikipedia)
    .slice(0, 10)
    .map(async (title) => {
      const url = getCommonsFileApiUrl(title);
      const data = await fetchJson(url);
      const page = Object.values(data.query.pages)[0] as any;
      if (!page.imageinfo?.length) {
        return null;
      }
      const image = page.imageinfo[0];
      return {
        imageUrl: decodeURI(image.thumburl),
        link: page.title,
        linkUrl: image.descriptionshorturl,
      };
    });
  const images = await Promise.all(promiseImages);

  return images
    .filter((img) => img)
    .map(({ imageUrl, link, linkUrl }) => ({
      imageUrl,
      link,
      linkUrl,
      description: `Wikipedia (${k}=*)`,
    }));
};

export const getImageFromApiRaw = async (def: ImageDef): ImagePromise => {
  if (isCenter(def)) {
    const { service, center } = def;
    if (service === 'mapillary') {
      return getMapillaryImage(center).then((img) => [img]);
    }

    if (service === 'fody') {
      return getFodyImage(center).then((img) => [img]);
    }
  }

  if (isTag(def)) {
    const { k, v } = def;
    if (k.startsWith('image') && v.startsWith('File:')) {
      return fetchCommonsFile(k, v);
    }
    if (k.startsWith('wikidata')) {
      return fetchWikidata(v);
    }
    if (k.startsWith('wikimedia_commons') && v.startsWith('File:')) {
      return fetchCommonsFile(k, v);
    }
    if (k.startsWith('wikimedia_commons') && v.startsWith('Category:')) {
      return fetchCommonsCategory(k, v);
    }
    if (k.startsWith('wikipedia')) {
      return fetchWikipedia(k, v);
    }
  }

  throw new Error(`No match in getImageFromApi(${JSON.stringify(def)})`);
};

export const getImageFromApi = async (def: ImageDef): ImagePromise => {
  try {
    if (isInstant(def)) {
      const img = getInstantImage(def);
      return img ? [img] : [];
    }

    const images = await getImageFromApiRaw(def);
    return images.filter((img) => img);
  } catch (e) {
    console.warn(e); // eslint-disable-line no-console
    return [];
  }
};
