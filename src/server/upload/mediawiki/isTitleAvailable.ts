import fetch from 'isomorphic-unfetch';
import { FORMAT, WIKI_URL } from './utils';

export const isTitleAvailable = async (title: string): Promise<boolean> => {
  const response = await fetch(WIKI_URL, {
    method: 'POST',
    body: new URLSearchParams({ action: 'query', titles: title, ...FORMAT }),
  });
  const data = await response.json();
  return Boolean(data.query.pages[0].missing);
};
