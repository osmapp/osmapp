// import { FormData } from 'formdata-node';

import { ReadStream } from 'node:fs';

export const WIKI_URL = 'https://test.wikipedia.org/w/api.php';
export const FORMAT = { format: 'json', formatversion: '2' };

export type UploadParams = Record<string, string | ReadStream>;

export const getUploadBody = (params: UploadParams) => {
  const formData = new FormData();
  Object.entries(params).forEach(([k, v]) => {
    formData.append(k, v as unknown as any);
  });
  return formData;
};

export const parseCookies = (response: Response) => {
  const headers = new Headers(response.headers);
  const setCookies = headers.getSetCookie();

  return setCookies
    .map((cookie) => {
      const [name, value] = cookie.split(';')[0].split('=');
      return `${name.trim()}=${value.trim()}`;
    })
    .join('; ');
};
