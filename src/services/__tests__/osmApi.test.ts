import { addFeatureCenterToCache, fetchFeature } from '../osmApi';
import * as helpers from '../../components/helpers';
import * as fetch from '../fetch';
import {
  NODE,
  NODE_FEATURE,
  RELATION,
  RELATION_FEATURE,
  WAY,
  WAY_FEATURE,
} from './osmApi.fixture';
import { intl } from '../intl';
import * as tagging from '../tagging/translations';
import * as idTaggingScheme from '../tagging/idTaggingScheme';

jest.mock('../../components/helpers', () => ({
  isServer: jest.fn(),
  isBrowser: jest.fn(),
}));

jest.mock('../fetch', () => ({
  fetchJson: jest.fn(),
}));

jest.mock('../tagging/translations', () => ({
  fetchSchemaTranslations: jest.fn(),
}));

jest.mock('../tagging/idTaggingScheme', () => ({
  addSchemaToFeature: jest.fn(),
}));

describe('fetchFeature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    intl.lang = 'en'; // TODO maybe refactor it without need for intl?
    jest.spyOn(tagging, 'fetchSchemaTranslations').mockResolvedValue(undefined); // fetchFeature() fetches the translations for getSchemaForFeature()
    jest
      .spyOn(idTaggingScheme, 'addSchemaToFeature')
      .mockImplementation((f) => f); // this is covered in idTaggingScheme.test.ts
  });

  const isServer = jest.spyOn(helpers, 'isServer').mockReturnValue(true);
  const isBrowser = jest.spyOn(helpers, 'isBrowser').mockReturnValue(false);

  it('should work for node', async () => {
    const fetchJson = jest.spyOn(fetch, 'fetchJson').mockResolvedValue(NODE);

    const feature = await fetchFeature({ type: 'node', id: 123 });
    expect(fetchJson).toHaveBeenCalledTimes(1);
    expect(feature).toEqual(NODE_FEATURE);
  });

  const OVERPASS_CENTER_RESPONSE = {
    elements: [{ center: { lat: 50, lon: 14 } }],
  };

  it('should work for way', async () => {
    const fetchJson = jest
      .spyOn(fetch, 'fetchJson')
      .mockImplementation((url) =>
        Promise.resolve(url.match(/overpass/) ? OVERPASS_CENTER_RESPONSE : WAY),
      );

    const feature = await fetchFeature({ type: 'way', id: 51050330 });
    expect(fetchJson).toHaveBeenCalledTimes(2);
    expect(feature).toEqual(WAY_FEATURE);
  });

  const OVERPASS_GEOM_RESPONSE = {
    elements: [{ geometry: { coordinates: [15, 51] } }],
  };

  it('should work for relation', async () => {
    const fetchJson = jest
      .spyOn(fetch, 'fetchJson')
      .mockImplementation((url) =>
        Promise.resolve(
          url.match(/overpass/) ? OVERPASS_GEOM_RESPONSE : RELATION,
        ),
      );

    const feature = await fetchFeature({ type: 'relation', id: 1234 });
    expect(fetchJson).toHaveBeenCalledTimes(2);
    expect(feature).toEqual(RELATION_FEATURE);
  });

  it('should return cached center for a way in BROWSER', async () => {
    isBrowser.mockReturnValue(true);
    isServer.mockReturnValue(false);
    addFeatureCenterToCache('w51050330', [123, 456]);

    const fetchJson = jest.spyOn(fetch, 'fetchJson').mockResolvedValue(WAY);

    const feature = await fetchFeature({ type: 'way', id: 51050330 });
    expect(fetchJson).toHaveBeenCalledTimes(1);
    expect(feature).toMatchObject({
      ...WAY_FEATURE,
      center: [123, 456],
      imageDefs: [
        { type: 'center', service: 'panoramax', center: [123, 456] },
        { type: 'center', service: 'kartaview', center: [123, 456] },
        { type: 'center', service: 'mapillary', center: [123, 456] },
      ],
    });
  });
});
