const urlRegExp = /^https?:\/\/.+/;

export const getUrlForTag = (k: string, v: string) => {
  if (k.match(/:?wikipedia$/)) {
    if (v.match(/:/)) {
      const [lang, article] = v.split(':');
      return `https://${lang}.wikipedia.org/wiki/${article}`;
    }
    return `https://wikipedia.org/wiki/${v}`;
  }
  if (k.match(/^wikipedia:/) || k.match(/:wikipedia/)) {
    const lang = k.split(':').pop();
    return `https://${lang}.wikipedia.org/wiki/${v}`;
  }
  if (k.match(/^wikidata$/) || k.match(/:wikidata$/)) {
    return `https://www.wikidata.org/wiki/${v}`;
  }
  if (k.match(/^wikimedia_commons$/)) {
    return `https://commons.wikimedia.org/wiki/${v}`;
  }
  if (k === 'image' && v.match(/^File:/)) {
    return `https://commons.wikimedia.org/wiki/${v}`;
  }
  if (k === 'ref:npu') {
    const id = encodeURIComponent(v);
    return `https://pamatkovykatalog.cz/uskp/podle-relevance/1/seznam/?h=${id}&chranenoTed=1&hlObj=1&fulltext`;
  }
  if (k === 'fhrs:id') {
    return `https://ratings.food.gov.uk/business/en-GB/${v}`;
  }
  if (k === 'ref:edubase') {
    return `https://get-information-schools.service.gov.uk/Establishments/Establishment/Details/${v}`;
  }
  if (k === 'gnis:feature_id') {
    // alternative url in https://github.com/openstreetmap/id-tagging-schema/issues/272
    return `https://edits.nationalmap.gov/apps/gaz-domestic/public/search/names/${v}`;
  }
  if (k === 'website') {
    return v.match(urlRegExp) ? v : `http://${v}`;
  }
  if (k === 'mapillary' && v.match(/^\d+$/)) {
    return `https://www.mapillary.com/app/?pKey=${v}&focus=photo`;
  }
  if (k === 'panoramax') {
    return `https://panoramax.xyz/#focus=pic&pic=${v}`;
  }
  if (k.match(/^(contact:)?email$/)) {
    return `mailto:${v}`;
  }
  if (v.match(urlRegExp)) {
    return v;
  }

  if (k === 'contact:facebook') {
    return `https://facebook.com/${v}`;
  }
  if (k === 'contact:youtube') {
    return v.startsWith('@')
      ? `https://youtube.com/${v}`
      : `https://youtube.com/@${v}`;
  }
  if (k === 'contact:instagram') {
    return `https://instagram.com/${v}`;
  }
  if (k === 'contact:vk') {
    return `https://vk.com/${v}`;
  }
  if (k === 'contact:twitter') {
    return `https://twitter.com/${v}`;
  }
  if (k === 'contact:matrix') {
    return `https://matrix.to/#/${v}`;
  }
  if (k === 'contact:mastodon') {
    return v.startsWith('@')
      ? `https://mastodon.social/${v}`
      : `https://mastodon.social/@${v}`;
  }
  if (k === 'contact:pinterest') {
    return `https://pinterest.com/${v}`;
  }
  if (k === 'contact:tiktok') {
    return v.startsWith('@')
      ? `https://tiktok.com/${v}`
      : `https://tiktok.com/@${v}`;
  }

  return null;
};
