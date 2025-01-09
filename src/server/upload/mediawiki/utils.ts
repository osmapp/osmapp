export const WIKI_URL = 'https://commons.wikimedia.org/w/api.php';
export const FORMAT = { format: 'json', formatversion: '2' };

export type UploadParams = Record<string, string | Blob>;

export const getUploadBody = (params: UploadParams) => {
  const formData = new FormData();
  Object.entries(params).forEach(([k, v]) => {
    formData.append(k, v);
  });
  return formData;
};

export const cookieJar = (cookies: string, response: Response) => {
  const oldCookies: Record<string, string> =
    cookies?.split(';').reduce((acc, c) => {
      const [name, value] = c.split('=');
      return { ...acc, [name.trim()]: value.trim() };
    }, {}) ?? {};

  const headers = new Headers(response.headers);
  headers.getSetCookie().forEach((cookie) => {
    const [name, value] = cookie.split(';')[0].split('=');
    oldCookies[name] = value;
  });

  const out = Object.entries(oldCookies)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');

  return out;
};
