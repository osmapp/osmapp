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

const getTileJson = async ({ z, x, y }: Tile) => {
  const data = await fetchJson(`/api/climbing-tiles/tile?z=${z}&x=${x}&y=${y}`);
  return data.features || [];
};

const updateData = async () => {
  const map = getGlobalMap();
  const mapZoom = map.getZoom();
  const z = mapZoom >= 12 ? 12 : mapZoom >= 9 ? 9 : mapZoom >= 6 ? 6 : 0;

  const bounds = map.getBounds();
  const northWest = bounds.getNorthWest();
  const southEast = bounds.getSouthEast();

  const tiles = computeTiles(z, northWest, southEast);

  const features = [];
  for (const tile of tiles) {
    const tileFeatures = await getTileJson(tile); // TODO consider showing results after each tile
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
    map.on('load', updateData);
    map.on('moveend', updateData);
    eventsAdded = true;
  }
};
