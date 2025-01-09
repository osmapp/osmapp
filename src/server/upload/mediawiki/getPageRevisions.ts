import fetch from 'isomorphic-unfetch';
import { WIKI_URL } from './utils';

type PageInfo = {
  ns: number;
  title: string;
  missing?: boolean;
  pageid?: number;
  revisions?: Revision[];
};

type Revision = {
  revid: number;
  parentid: number;
  slots: Record<
    'main' | 'mediainfo',
    { contentmodel: string; contentformat: string; content: string }
  >;
};

export const getPageRevisions = async (titles: string[]) => {
  const queryString = new URLSearchParams({
    action: 'query',
    prop: 'revisions',
    titles: titles.join('|'),
    rvprop: 'ids|content',
    rvslots: '*',
    formatversion: '2',
    format: 'json',
  });
  const response = await fetch(`${WIKI_URL}?${queryString}`);
  const data = await response.json();
  return data.query.pages as PageInfo[];
};
