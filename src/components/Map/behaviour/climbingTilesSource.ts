import { GeoJSONSource, LngLat } from 'maplibre-gl';
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
    { nocache: true },
  );
  return data.features || [];
}

async function getTileData(z, x, y) {
  const features = await fetchGeoJSONData(z, x, y);
  return features;
}

/*
    -180          +180  = x = longitude
+90 +----------------+
    |                |
    |                |
-90 +----------------+
  = y = latitude
* */

const getTile = (z: number, { lng, lat }: LngLat) => {
  const xNorm = (lng + 180) / 360;
  const x = Math.floor(xNorm * Math.pow(2, z));
  const yRad = (lat * Math.PI) / 180;
  const correction = 1 / Math.cos(yRad); // on pole 90° = infinity
  const yNorm = (1 - Math.log(Math.tan(yRad) + correction) / Math.PI) / 2; // defined on 0°-85°
  const y = Math.floor(yNorm * Math.pow(2, z));
  return { x, y, z };
};

async function updateGeoJSONSource() {
  const map = getGlobalMap();
  const mapZoom = map.getZoom();
  const z = mapZoom >= 12 ? 12 : 4;

  const bounds = map.getBounds();
  const nwTile = getTile(z, bounds.getNorthWest());
  const seTile = getTile(z, bounds.getSouthEast());

  const tiles = [];
  for (let x = nwTile.x; x <= seTile.x; x++) {
    for (let y = nwTile.y; y <= seTile.y; y++) {
      tiles.push({ z, x, y });
    }
  }

  console.log({ tiles });

  const features = [];
  const tileFeatures = await getTileData(7, 69, 43);
  features.push(...tileFeatures);
  // for (const tile of tiles) {
  //   const tileFeatures = await getTileData(tile.z, tile.x, tile.y);
  //   features.push(...tileFeatures);
  // }

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
