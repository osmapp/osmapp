import { GeoJSONSource } from 'maplibre-gl';
import { fetchJson } from '../../../services/fetch';
import { EMPTY_GEOJSON_SOURCE, OSMAPP_SPRITE } from '../consts';
import { getGlobalMap } from '../../../services/mapStorage';
import {
  CLIMBING_SPRITE,
  CLIMBING_TILES_SOURCE,
  climbingLayers,
} from './climbingLayers';
import type { StyleSpecification } from '@maplibre/maplibre-gl-style-spec';
import { Tile } from '../../../types';
import { computeTiles } from './computeTiles';

const HOST = 'https://openclimbing.org/';

const getTileJson = async ({ z, x, y }: Tile) => {
  const url = `${HOST}api/climbing-tiles/tile?z=${z}&x=${x}&y=${y}`;
  const data = await fetchJson(url);
  return data.features || [];
};

const updateData = async () => {
  const map = getGlobalMap();
  const mapZoom = map.getZoom();
  const z = mapZoom >= 13 ? 12 : mapZoom >= 10 ? 9 : mapZoom >= 7 ? 6 : 0;

  const bounds = map.getBounds();
  const northWest = bounds.getNorthWest();
  const southEast = bounds.getSouthEast();

  const tiles = computeTiles(z, northWest, southEast);

  const features = [];
  for (const tile of tiles) {
    const tileFeatures = await getTileJson(tile); // TODO consider showing results after each tile is loaded
    features.push(...tileFeatures);
  }

  map?.getSource<GeoJSONSource>(CLIMBING_TILES_SOURCE)?.setData({
    type: 'FeatureCollection' as const,
    features,
  });
};

let eventsAdded = false;

export const addClimbingTilesSource = (style: StyleSpecification) => {
  style.sources[CLIMBING_TILES_SOURCE] = EMPTY_GEOJSON_SOURCE;
  style.sprite = [...OSMAPP_SPRITE, CLIMBING_SPRITE];
  style.layers.push(...climbingLayers); // must be also in `layersWithOsmId` because of hover effect

  if (!eventsAdded) {
    const map = getGlobalMap();
    map.on('style.load', updateData);
    map.on('moveend', updateData);
    eventsAdded = true;
  }
};

export const removeClimbingTilesSource = () => {
  if (eventsAdded) {
    const map = getGlobalMap();
    map.off('style.load', updateData);
    map.off('moveend', updateData);
    eventsAdded = false;
  }
};
