import { resolveCountryCode } from 'next-codegrid';
import { FetchError, getShortId, getUrlOsmId } from './helpers';
import { fetchJson } from './fetch';
import {
  Feature,
  LonLat,
  OsmId,
  Position,
  RelationMember,
  SuccessInfo,
} from './types';
import { removeFetchCache } from './fetchCache';
import { overpassAroundToSkeletons } from './overpassAroundToSkeletons';
import { isBrowser } from '../components/helpers';
import { addSchemaToFeature } from './tagging/idTaggingScheme';
import { fetchSchemaTranslations } from './tagging/translations';
import { osmToFeature } from './osmToFeature';
import { getImageDefs, mergeMemberImageDefs } from './images/getImageDefs';
import * as Sentry from '@sentry/nextjs';
import { fetchOverpassCenter } from './overpass/fetchOverpassCenter';
import {
  isClimbingRelation,
  isClimbingRoute,
  isPublictransportRoute,
  isRouteMaster,
  publishDbgObject,
} from '../utils';
import { getOverpassUrl } from './overpassSearch';
import { API_SERVER, OSM_WEBSITE } from './osmApiConsts';

const getOsmUrl = ({ type, id }: OsmId) =>
  `${API_SERVER}/api/0.6/${type}/${id}.json`;
const getOsmFullUrl = ({ type, id }: OsmId) =>
  `${API_SERVER}/api/0.6/${type}/${id}/full.json`;
const getOsmParentUrl = ({ type, id }: OsmId) =>
  `${API_SERVER}/api/0.6/${type}/${id}/relations.json`;
const getOsmHistoryUrl = ({ type, id }: OsmId) =>
  `${API_SERVER}/api/0.6/${type}/${id}/history.json`;
const getOsmUrlOrFull = ({ type, id }: OsmId) =>
  type === 'node' ? getOsmUrl({ type, id }) : getOsmFullUrl({ type, id });

type OsmTypes = 'node' | 'way' | 'relation';
type OsmElement<T extends OsmTypes = 'node' | 'way' | 'relation'> = {
  type: T;
  id: number;
  lat: number;
  lon: number;
  timestamp: string;
  version: number;
  changeset: number;
  user: string;
  uid: number;
  tags: Record<string, string>;
  members?: RelationMember[];
};
type OsmResponse = {
  elements: OsmElement[];
};

export const getOsmElement = async (apiId: OsmId) => {
  const { elements } = await fetchJson<OsmResponse>(getOsmUrl(apiId)); // TODO 504 gateway busy
  return elements?.[0];
};

export const quickFetchFeature = async (apiId: OsmId) => {
  try {
    const element = await getOsmElement(apiId);
    return osmToFeature(element);
  } catch (e) {
    return {
      error: e instanceof FetchError ? e.code : 'unknown',
    } as unknown as Feature;
  }
};

const getOsmPromise = async (apiId: OsmId) => {
  try {
    return await getOsmElement(apiId);
  } catch (e) {
    if (e instanceof FetchError && e.code === '410') {
      const { elements } = await fetchJson(getOsmHistoryUrl(apiId)); // TODO use multi fetch instead of history: https://wiki.openstreetmap.org/wiki/API_v0.6#Multi_fetch:_GET_/api/0.6/[nodes|ways|relations]?#parameters
      const length = elements?.length;

      if (length >= 2) {
        const lastWithTags = elements[length - 2];
        const last = elements[length - 1];
        return { ...lastWithTags, ...last, osmappDeletedMarker: true };
      }
    }
    throw e;
  }
};

const getOsmParentPromise = async (apiId: OsmId) => {
  const { elements } = await fetchJson(getOsmParentUrl(apiId));
  return { elements };
};

/**
 * This holds coords of clicked ways/relations (from vector map), these are often different than those computed by us
 * TODO: we should probably store just the last one, but this cant get too big, right?
 */
const featureCenterCache: Record<string, LonLat> = {};
export const addFeatureCenterToCache = (shortId: string, center: LonLat) => {
  featureCenterCache[shortId] = center;
  publishDbgObject('featureCenterCache', featureCenterCache);
};

const getCenterPromise = async (apiId: OsmId): Promise<LonLat | false> => {
  if (apiId.type === 'node') return false;

  if (isBrowser() && featureCenterCache[getShortId(apiId)]) {
    return featureCenterCache[getShortId(apiId)]; // just use the coordinate where user clicked
  }

  try {
    return await fetchOverpassCenter(apiId);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('getCenterPromise()', e); // eg. 529 too many requests
    return false;
  }
};

export const clearFeatureCache = (apiId) => {
  removeFetchCache(getOsmUrl(apiId)); // watch out, must be same as in getOsmPromise()
  removeFetchCache(getOsmHistoryUrl(apiId));
};

const getCountryCode = async (feature: Feature): Promise<string | null> => {
  try {
    return await resolveCountryCode(feature.center); // takes 0-100ms for first resolution, then instant
  } catch (e) {
    console.warn('countryCode left empty – resolveCountryCode():', e); // eslint-disable-line no-console
    Sentry.captureException(e, { extra: { feature } });
  }
  return null;
};

export const getRelationElementsAndCenter = async (apiId: OsmId) => {
  const element = await getOsmPromise(apiId);
  const getPositionOfFirstItem =
    isPublictransportRoute({ tags: element.tags }) ||
    isRouteMaster({
      tags: element.tags,
      osmMeta: apiId,
    });
  const center = getPositionOfFirstItem
    ? await fetchOverpassCenter({
        id: element.members[0].ref,
        type: element.members[0].type,
      })
    : await fetchOverpassCenter(apiId);

  return { element, center };
};

const getElementsAndCenter = async (apiId: OsmId) => {
  const cachedCenter = featureCenterCache[getShortId(apiId)];
  if (isBrowser() && cachedCenter) {
    return {
      center: cachedCenter,
      element: await getOsmPromise(apiId),
    };
  }
  switch (apiId.type) {
    case 'node':
      return {
        element: await getOsmPromise(apiId),
        center: false as const,
      };
    case 'way':
      const [elementWay, center] = await Promise.all([
        getOsmPromise(apiId),
        getCenterPromise(apiId),
      ]);
      return { element: elementWay, center };
    case 'relation':
      return getRelationElementsAndCenter(apiId);
  }
};

export const fetchFeatureWithCenter = async (apiId: OsmId) => {
  const [{ element, center }] = await Promise.all([
    getElementsAndCenter(apiId),
    fetchSchemaTranslations(),
  ]);

  const feature = osmToFeature(element);
  if (!feature.center && center) {
    feature.center = center;
    feature.imageDefs = getImageDefs(feature.tags, center);
  }

  if (feature.center) {
    const countryCode = await getCountryCode(feature);
    if (countryCode) {
      feature.countryCode = countryCode;
    }
  }

  return addSchemaToFeature(feature);
};

export const fetchParentFeatures = async (apiId: OsmId) => {
  const { elements } = await getOsmParentPromise(apiId);
  return elements.map((element) => addSchemaToFeature(osmToFeature(element)));
};

const getItemsMap = (elements: OsmElement[]) => {
  const map = {
    node: {} as Record<number, OsmElement<'node'>>,
    way: {} as Record<number, OsmElement<'way'>>,
    relation: {} as Record<number, OsmElement<'relation'>>,
  };
  elements.forEach((element) => {
    map[element.type][element.id] = element;
  });
  return map;
};

const getMemberFeatures = (members: Feature['members'], map) => {
  return (
    members
      ?.map(({ type, ref, role }) => {
        const element = map[type][ref];
        if (!element) {
          return null;
        }

        const feature = addSchemaToFeature(osmToFeature(element));
        feature.osmMeta.role = role;
        feature.center = element.center
          ? [element.center.lon, element.center.lat] // from overpass "out center"
          : feature.center;
        return feature;
      })
      .filter(Boolean) ?? []
  );
};

export const fetchWithMemberFeatures = async (apiId: OsmId) => {
  if (apiId.type !== 'relation') {
    const wayOrNodeResponse = await fetchJson(getOsmUrl(apiId));
    const wayOrNode = wayOrNodeResponse.elements[0];
    return addSchemaToFeature(osmToFeature(wayOrNode));
  }

  const full = await fetchJson(getOsmFullUrl(apiId));
  const map = getItemsMap(full.elements);
  const relation = map.relation[apiId.id];

  const out: Feature = {
    ...addSchemaToFeature(osmToFeature(relation)),
    memberFeatures: getMemberFeatures(relation.members, map),
  };
  mergeMemberImageDefs(out);
  return out;
};

const addMemberFeaturesToArea = async (relation: Feature) => {
  const { osmMeta } = relation;
  const url = getOverpassUrl(`[out:json];rel(${osmMeta.id});>>;out center qt;`);
  const overpass = await fetchJson(url);
  const itemsMap = getItemsMap(overpass.elements);
  const memberFeatures = getMemberFeatures(relation.members, itemsMap).map(
    (memberFeature) => {
      const crag: Feature = {
        ...memberFeature,
        memberFeatures: getMemberFeatures(memberFeature.members, itemsMap),
      };
      mergeMemberImageDefs(crag);
      return crag;
    },
  );

  // TODO merge this with osmToFeature()
  if (relation.center) {
    const countryCode = await getCountryCode(relation);
    if (countryCode) {
      relation.countryCode = countryCode;
    }
  }

  return { ...relation, memberFeatures };
};

export const getFullFeatureWithMemberFeatures = async (apiId: OsmId) => {
  await fetchSchemaTranslations();
  const full = await fetchJson<OsmResponse>(getOsmUrlOrFull(apiId));
  const map = getItemsMap(full.elements);
  const feature = addSchemaToFeature(osmToFeature(map[apiId.type][apiId.id]));
  return {
    ...feature,
    memberFeatures: getMemberFeatures(feature.members, map),
  };
};

const addMemberFeaturesToRelation = async (relation: Feature) => {
  const { tags, osmMeta: apiId } = relation;
  if (apiId.type !== 'relation') {
    throw new Error('addMemberFeaturesToRelation() called with non-relation');
  }

  if (tags.climbing === 'area') {
    return await addMemberFeaturesToArea(relation);
  }

  const full = await getFullFeatureWithMemberFeatures(apiId);
  const out: Feature = {
    ...relation,
    memberFeatures: full.memberFeatures,
  };
  mergeMemberImageDefs(out);
  return out;
};

// TODO parent should be probably fetched for every feaure in fetchFeatureWithCenter()
//  - wait until UI is prepared
//  - maybe this can be merged in fetchFeatureWithCenter()
//  - check: Warning: data for page "/[[...all]]" (path "/relation/4810774") is 627 kB which exceeds the threshold of 128 kB, this amount of data can reduce performance. See more info here: https://nextjs.org/docs/messages/large-page-data
export const addMembersAndParents = async (
  feature: Feature,
): Promise<Feature> => {
  if (isClimbingRoute(feature)) {
    const parentFeatures = await fetchParentFeatures(feature.osmMeta);
    return { ...feature, parentFeatures };
  }

  if (
    isClimbingRelation(feature) ||
    isPublictransportRoute(feature) ||
    isRouteMaster(feature)
  ) {
    const [parentFeatures, featureWithMemberFeatures] = await Promise.all([
      fetchParentFeatures(feature.osmMeta),
      addMemberFeaturesToRelation(feature),
    ]);

    return {
      ...featureWithMemberFeatures,
      center: feature.center, // feature contains correct center from centerCache or overpass
      parentFeatures,
    };
  }

  return feature;
};

export const fetchFeature = async (apiId: OsmId): Promise<Feature> => {
  try {
    // offline features for testing
    if (apiId.type === 'relation' && apiId.id === 6) {
      await fetchSchemaTranslations();
      const osmApiTestItems = await import('./osmApiTestItems');
      return osmApiTestItems.TEST_CRAG;
    }
    if (apiId.type === 'node' && apiId.id === 6) {
      await fetchSchemaTranslations();
      const osmApiTestItems = await import('./osmApiTestItems');
      return osmApiTestItems.TEST_NODE;
    }

    const feature = await fetchFeatureWithCenter(apiId);
    const finalFeature = await addMembersAndParents(feature);

    return finalFeature;
  } catch (e) {
    console.error(`fetchFeature(${getShortId(apiId)}):`, e); // eslint-disable-line no-console

    const error = (
      e instanceof FetchError ? e.code : 'unknown'
    ) as Feature['error'];

    return {
      type: 'Feature',
      skeleton: true,
      nonOsmObject: false,
      osmMeta: apiId,
      center: undefined,
      tags: { name: getUrlOsmId(apiId) },
      properties: { class: '', subclass: '' },
      error,
    };
  }
};

export const insertOsmNote = async (
  point: Position,
  text: string,
): Promise<SuccessInfo> => {
  const [lon, lat] = point;

  const body = new URLSearchParams();
  body.append('lat', `${lat}`);
  body.append('lon', `${lon}`);
  body.append('text', text);

  // {"type":"Feature","geometry":{"type":"Point","coordinates":[14.3244982,50.0927863]},"properties":{"id":26569,"url":"https://master.apis.dev.openstreetmap.org/api/0.6/notes/26569.json","comment_url":"https://master.apis.dev.openstreetmap.org/api/0.6/notes/26569/comment.json","close_url":"https://master.apis.dev.openstreetmap.org/api/0.6/notes/26569/close.json","date_created":"2021-04-17 10:37:44 UTC","status":"open","comments":[{"date":"2021-04-17 10:37:44 UTC","action":"opened","text":"way/39695868! Place was marked permanently closed.From https://osmapp.org/way/39695868","html":"\u003cp\u003eway/39695868! Place was marked permanently closed.From \u003ca href=\"https://osmapp.org/way/39695868\" rel=\"nofollow noopener noreferrer\"\u003ehttps://osmapp.org/way/39695868\u003c/a\u003e\u003c/p\u003e"}]}}
  const reply = await fetchJson(`${API_SERVER}/api/0.6/notes.json`, {
    nocache: true,
    method: 'POST',
    body,
  });

  const noteId = reply.properties.id;
  return {
    type: 'note',
    text,
    url: `${OSM_WEBSITE}/note/${noteId}`,
  };
};

const getAroundUrl = ([lat, lon]: Position) =>
  getOverpassUrl(
    `[timeout:5][out:json];(
        relation[~"."~"."](around:50,${lon},${lat});
        way[~"."~"."](around:50,${lon},${lat});
        node[~"."~"."](around:50,${lon},${lat});
      );out body qt center;`,
  );

export const fetchAroundFeature = async (point: Position) => {
  const response = await fetchJson(getAroundUrl(point));
  return overpassAroundToSkeletons(response);
};
