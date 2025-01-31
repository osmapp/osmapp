import { isBrowser } from '../components/helpers';
import { prod } from './helpers';

const cache = {};

const fetchCache =
  !prod && isBrowser() // lets leave the sessionStorage cache only for DEV mode
    ? {
        get: (key: string) => sessionStorage.getItem(key),
        remove: (key: string) => sessionStorage.removeItem(key),
        put: (key: string, value: string) => sessionStorage.setItem(key, value),
        clear: () => sessionStorage.clear(), // this is little dirty, but we use sessionStorage only for this
      }
    : {
        get: (key: string) => cache[key],
        remove: (key: string) => delete cache[key],
        put: (key: string, value: string) => {
          cache[key] = value;
        },
        clear: () => {
          Object.keys(cache).forEach((key) => delete cache[key]);
        },
      };

export const getKey = (url: string, opts: Record<string, any>) => {
  if (['POST', 'PUT', 'DELETE'].includes(opts.method)) {
    return false;
  }

  return url + JSON.stringify(opts);
};

export const getCache = (key: string | false) => {
  if (key) {
    return fetchCache.get(key);
  }
};

export const removeFetchCache = (
  url: string,
  opts: Record<string, any> = {},
) => {
  const key = getKey(url, opts);
  if (key) {
    fetchCache.remove(key);
  }
};

export const writeCacheSafe = (key: string | false, value: string) => {
  if (!key) return;

  try {
    fetchCache.put(key, value);
  } catch (e) {
    if (e.message.includes('exceeded the quota')) {
      fetchCache.clear();
    }
    console.warn(`Item ${key} was not saved to cache: `, e); // eslint-disable-line no-console
  }
};

export const clearFetchCache = () => {
  fetchCache.clear();
};
