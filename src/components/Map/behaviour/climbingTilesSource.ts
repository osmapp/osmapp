import { GeoJSONSource } from 'maplibre-gl';
import { fetchJson } from '../../../services/fetch';
import { EMPTY_GEOJSON_SOURCE, OSMAPP_SPRITE } from '../consts';
import { getGlobalMap } from '../../../services/mapStorage';
import {
  CLIMBING_SPRITE,
  climbingLayers,
} from '../styles/layers/climbingLayers';
import type { StyleSpecification } from '@maplibre/maplibre-gl-style-spec';

const SOURCE_NAME = 'climbing-tiles';

async function fetchGeoJSONData(z, x, y) {
  const data = await fetchJson(
    `/api/climbing-tiles/tile?z=${z}&x=${x}&y=${y}&type=json`,
  );
  return data.features || [];
}

async function getTileData(z, x, y) {
  const features = await fetchGeoJSONData(z, x, y);
  return features;
}

async function updateGeoJSONSource() {
  const map = getGlobalMap();
  const mapZoom = map.getZoom();
  const z = mapZoom < 12 ? 10 : 12;

  const bounds = map.getBounds();
  const nw = bounds.getNorthWest();
  const se = bounds.getSouthEast();

  const nwTile = {
    x: Math.floor(((nw.lng + 180) / 360) * Math.pow(2, z)),
    y: Math.floor(
      ((1 -
        Math.log(
          Math.tan((nw.lat * Math.PI) / 180) +
            1 / Math.cos((nw.lat * Math.PI) / 180),
        ) /
          Math.PI) /
        2) *
        Math.pow(2, z),
    ),
    z,
  };

  const seTile = {
    x: Math.floor(((se.lng + 180) / 360) * Math.pow(2, z)),
    y: Math.floor(
      ((1 -
        Math.log(
          Math.tan((se.lat * Math.PI) / 180) +
            1 / Math.cos((se.lat * Math.PI) / 180),
        ) /
          Math.PI) /
        2) *
        Math.pow(2, z),
    ),
    z,
  };

  console.log({ nwTile, seTile });

  const tiles = [];
  for (let x = nwTile.x; x <= seTile.x; x++) {
    for (let y = nwTile.y; y <= seTile.y; y++) {
      tiles.push({ z, x, y });
    }
  }

  console.log({ tiles });

  const features = [];
  for (const tile of tiles) {
    const tileFeatures = await getTileData(tile.z, tile.x, tile.y);
    features.push(...tileFeatures);
  }

  console.log({ features });

  map.getSource<GeoJSONSource>(SOURCE_NAME).setData({
    type: 'FeatureCollection' as const,
    features,
  });
}

export const addClimbingTilesSource = (style: StyleSpecification) => {
  style.sources[SOURCE_NAME] = EMPTY_GEOJSON_SOURCE;
  style.sprite = [...OSMAPP_SPRITE, CLIMBING_SPRITE];
  style.layers.push(
    ...climbingLayers.map((x) => ({
      ...x,
      source: SOURCE_NAME,
    })),
  ); // must be also in `layersWithOsmId` because of hover effect

  const map = getGlobalMap();
  map.on('moveend', () => {
    updateGeoJSONSource();
  });
};
