import { fetchJson } from '../fetch';
import { isInstant, ImageDef, isCenter, isTag } from '../types';
import { getMapillaryImage, MAPILLARY_ACCESS_TOKEN } from './getMapillaryImage';
import { getFodyImage } from './getFodyImage';
import { getInstantImage, WIDTH, ImageType } from './getImageDefs';
import { encodeUrl } from '../../helpers/utils';
import { getCommonsImageUrl } from './getCommonsImageUrl';
import { getKartaViewImage } from './getkartaViewImage';
import { getPanoramaxImage } from './getPanoramaxImage';

type ImagePromise = Promise<ImageType | null>;

const getCommonsFileApiUrl = (title: string) =>
  encodeUrl`https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&iiurlwidth=${WIDTH}&format=json&titles=${title}&origin=*`;

const fetchCommonsFile = async (k: string, v: string): ImagePromise => {
  const url = getCommonsFileApiUrl(v);
  const data = await fetchJson(url);
  const page = Object.values(data.query.pages)[0] as any;
  if (!page.imageinfo?.length) {
    return null;
  }
  const image = page.imageinfo[0];
  return {
    imageUrl: decodeURI(image.thumburl),
    description: `Wikimedia Commons (${k}=*)`,
    link: page.title,
    linkUrl: image.descriptionshorturl,
    // portrait: images[0].thumbwidth < images[0].thumbheight,
  };
};

// TODO perhaps fetch more images, or create a collage of first few images
const getCommonsCategoryApiUrl = (title: string) =>
  encodeUrl`https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=${title}&gcmlimit=1&gcmtype=file&prop=imageinfo&&iiprop=url&iiurlwidth=${WIDTH}&format=json&origin=*`;

const fetchCommonsCategory = async (k: string, v: string): ImagePromise => {
  const url = getCommonsCategoryApiUrl(v);
  const data = await fetchJson(url);
  const page = Object.values(data.query.pages)[0] as any;
  if (!page.imageinfo?.length) {
    return null;
  }
  const image = page.imageinfo[0];
  return {
    imageUrl: decodeURI(image.thumburl),
    description: `Wikimedia Commons category (${k}=*)`,
    link: v,
    linkUrl: `https://commons.wikimedia.org/wiki/${v}`,
    // portrait: images[0].thumbwidth < images[0].thumbheight,
  };
};

const getWikidataApiUrl = (entity: string) =>
  encodeUrl`https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&format=json&entity=${entity}&origin=*`;

const fetchWikidata = async (entity: string): ImagePromise => {
  const url = getWikidataApiUrl(entity);
  const data = await fetchJson(url);

  if (!data.claims?.P18) {
    return null;
  }

  const imagesP18 = data.claims.P18;
  const candidates =
    imagesP18.length > 1
      ? imagesP18.filter(({ rank }) => rank !== 'deprecated')
      : [];
  const entry = candidates.length > 0 ? candidates[0] : imagesP18[0];
  const file = `File:${entry.mainsnak.datavalue.value}`;
  return {
    imageUrl: decodeURI(getCommonsImageUrl(file, WIDTH)),
    description: 'Wikidata image (wikidata=*)',
    link: entity,
    linkUrl: `https://www.wikidata.org/wiki/${entity}`,
  };
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

const getWikipediaApiUrl = (country: string, title: string) =>
  encodeUrl`https://${country}.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=${WIDTH}&format=json&titles=${title}&origin=*`;

const fetchWikipedia = async (k: string, v: string): ImagePromise => {
  const { country, title } = parseWikipedia(k, v);
  const url = getWikipediaApiUrl(country, title);
  const data = await fetchJson(url);
  const page = Object.values(data.query.pages)[0] as any;
  if (!page.pageimage) {
    return null;
  }
  return {
    imageUrl: decodeURI(page.thumbnail.source), // it has to be decoded, because wikipedia encodes brackets (), but encodeURI doesnt
    description: `Wikipedia (${k}=*)`,
    link: `File:${page.pageimage}`,
    linkUrl: `https://commons.wikimedia.org/wiki/File:${page.pageimage}`,
    // portrait: page.thumbnail.width < page.thumbnail.height,
  };
};

type MapillaryResponse = {
  is_pano: boolean;
  thumb_1024_url: string;
  thumb_original_url: string;
  id: string;
};

const fetchMapillaryTag = async (k: string, v: string): ImagePromise => {
  const fields = ['is_pano', 'thumb_1024_url', 'thumb_original_url'];
  const url = `https://graph.mapillary.com/${v}?fields=thumb_1024_url&access_token=${MAPILLARY_ACCESS_TOKEN}&fields=${fields.join(',')}`;
  const data = await fetchJson<MapillaryResponse>(url);

  return {
    ...(data.is_pano ? { panoramaUrl: data.thumb_original_url } : {}),
    imageUrl: data.thumb_1024_url,
    link: 'Mapillary',
    linkUrl: `https://www.mapillary.com/app/?pKey=${v}&focus=photo`,
    description: `Mapillary (${k}=*)`,
  };
};

export const getImageFromApiRaw = async (def: ImageDef): ImagePromise => {
  if (isCenter(def)) {
    const { service, center } = def;
    if (service === 'mapillary') {
      return getMapillaryImage(center);
    }
    if (service === 'kartaview') {
      return getKartaViewImage(center);
    }
    if (service === 'panoramax') {
      return getPanoramaxImage(center);
    }

    if (service === 'fody') {
      return getFodyImage(center);
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
    if (k.startsWith('mapillary')) {
      return fetchMapillaryTag(k, v);
    }
  }

  throw new Error(`No match in getImageFromApi(${JSON.stringify(def)})`);
};

export const getImageFromApi = async (def: ImageDef): ImagePromise => {
  try {
    if (isInstant(def)) {
      return getInstantImage(def);
    }

    return await getImageFromApiRaw(def);
  } catch (e) {
    console.warn(e); // eslint-disable-line no-console
    return null;
  }
};
