import type { NextApiRequest, NextApiResponse } from 'next';
import { serverFetchOsmUser } from '../../src/server/osmApiAuthServer';
import {
  fetchFeatureWithCenter,
  fetchParentFeatures,
} from '../../src/services/osmApi';
import { intl, setIntl } from '../../src/services/intl';
import { getExifData } from '../../src/server/upload/getExifData';
import { uploadToWikimediaCommons } from '../../src/server/upload/uploadToWikimediaCommons';
import { getApiId } from '../../src/services/helpers';
import { File } from '../../src/server/upload/types';
import { setProjectForSSR } from '../../src/services/project';
import { fetchToFile } from '../../src/server/upload/fetchToFile';
import { OsmId } from '../../src/services/types';
import { isClimbingRoute } from '../../src/utils';
import { Feature } from '../../src/services/types';

// inspiration: https://commons.wikimedia.org/wiki/File:Drive_approaching_the_Grecian_Lodges_-_geograph.org.uk_-_5765640.jpg
// https://github.com/multichill/toollabs/blob/master/bot/commons/geograph_uploader.py
// TODO https://commons.wikimedia.org/wiki/Template:Geograph_from_structured_data

const getFeature = async (apiId: OsmId): Promise<Feature> => {
  const feature = await fetchFeatureWithCenter(apiId);
  if (isClimbingRoute(feature)) {
    const parentFeatures = await fetchParentFeatures(feature.osmMeta);
    return { ...feature, parentFeatures };
  }
  return feature;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { shortId, lang, url, filename } = JSON.parse(req.body);
    setIntl({ lang, messages: [] });
    setProjectForSSR(req);

    const apiId = getApiId(shortId);
    const feature = await getFeature(apiId);
    console.log('intl', intl); // eslint-disable-line no-console
    const user = await serverFetchOsmUser(req.cookies.osmAccessToken);

    const filepath = await fetchToFile(url);
    const { location, date } = await getExifData(filepath);
    const file: File = { filepath, filename, location, date };
    const out = await uploadToWikimediaCommons(user, feature, file, lang);

    res.status(200).json(out);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
