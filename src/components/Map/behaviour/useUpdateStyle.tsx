/* eslint-disable no-param-reassign */
import type { GeoJSONSource, Map } from 'maplibre-gl';
import { OpenMapTilesLanguage } from '@teritorio/openmaptiles-gl-language';
import cloneDeep from 'lodash/cloneDeep';
import type { StyleSpecification } from '@maplibre/maplibre-gl-style-spec';
import { createMapEffectHook } from '../../helpers';
import { basicStyle } from '../styles/basicStyle';
import { outdoorStyle } from '../styles/outdoorStyle';
import { osmappLayers } from '../../LayerSwitcher/osmappLayers';
import { getRasterStyle } from '../styles/rasterStyle';
import { DEFAULT_MAP } from '../../../config.mjs';
import { makinaAfricaStyle } from '../styles/makinaAfricaStyle';
import {
  CLIMBING_SPRITE,
  climbingLayers,
} from '../styles/layers/climbingLayers';
import { EMPTY_GEOJSON_SOURCE, OSMAPP_SPRITE } from '../consts';
import { fetchCrags } from '../../../services/fetchCrags';
import { intl } from '../../../services/intl';
import { Layer } from '../../utils/MapStateContext';
import { setUpHover } from './featureHover';
import { layersWithOsmId } from '../helpers';

const getBaseStyle = (key: string): StyleSpecification => {
  if (key === 'basic') {
    return basicStyle;
  }
  if (key === 'makinaAfrica') {
    return makinaAfricaStyle;
  }
  if (key === 'outdoor') {
    return outdoorStyle;
  }

  return getRasterStyle(key);
};

const addRasterOverlay = (style: StyleSpecification, overlayKey: string) => {
  const raster = getRasterStyle(overlayKey);
  style.sources[overlayKey] = raster.sources[overlayKey];
  style.layers.push(raster.layers[0]);
  // TODO maxzoom 19 only for snow overlay
};

const addClimbingOverlay = (style: StyleSpecification, map: Map) => {
  style.sources.climbing = EMPTY_GEOJSON_SOURCE;
  style.layers.push(...climbingLayers); // must be also in `layersWithOsmId` because of hover effect
  style.sprite = [...OSMAPP_SPRITE, CLIMBING_SPRITE];

  fetchCrags().then(
    (geojson) => {
      const geojsonSource = map.getSource('climbing') as GeoJSONSource;
      geojsonSource?.setData(geojson); // TODO can be undefined at first map render
    },
    (error) => {
      console.warn('Climbing Layer failed to fetch.', error); // eslint-disable-line no-console
    },
  );
};

const addOverlaysToStyle = (
  map: Map,
  style: StyleSpecification,
  overlays: string[],
) => {
  overlays.forEach((overlayKey: string) => {
    const overlay = osmappLayers[overlayKey];

    if (overlay?.type === 'overlay') {
      addRasterOverlay(style, overlayKey);
    }

    if (overlay?.type === 'overlayClimbing') {
      addClimbingOverlay(style, map);
    }
  });
};

export const useUpdateStyle = createMapEffectHook(
  (map, activeLayers: string[], userLayers: Layer[], mapLoaded: boolean) => {
    const [basemap, ...overlays] = activeLayers;
    const key = basemap ?? DEFAULT_MAP;

    const osmappLayerMaxZoom = osmappLayers[key]?.maxzoom;
    const userLayerMaxZoom = userLayers.find(({ url }) => url === key)?.maxzoom;
    map.setMaxZoom(osmappLayerMaxZoom ?? userLayerMaxZoom ?? 24); // TODO find a way how to zoom bing further (now it stops at 19)

    const osmappLayerMinZoom = osmappLayers[key]?.minzoom;
    const userLayerMinZoom = userLayers.find(({ url }) => url === key)?.minzoom;
    map.setMinZoom(osmappLayerMinZoom ?? userLayerMinZoom ?? 0);

    const style = cloneDeep(getBaseStyle(key));
    addOverlaysToStyle(map, style, overlays);
    map.setStyle(style, { diff: mapLoaded });

    const languageControl = new OpenMapTilesLanguage({
      defaultLanguage: intl.lang,
    });
    map.addControl(languageControl);

    setUpHover(map, layersWithOsmId(style));
  },
);
