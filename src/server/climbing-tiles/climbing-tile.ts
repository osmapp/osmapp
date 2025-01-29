import { BBox, FeatureCollection } from 'geojson';
import { getClient } from './db';

const r2d = 180 / Math.PI;

function tile2lon(x: number, z: number): number {
  return (x / Math.pow(2, z)) * 360 - 180;
}

function tile2lat(y: number, z: number): number {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  return r2d * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}
export function tileToBBOX([z, x, y]: TileNumber): BBox {
  const e = tile2lon(x + 1, z);
  const w = tile2lon(x, z);
  const s = tile2lat(y + 1, z);
  const n = tile2lat(y, z);
  return [w, s, e, n];
}

export type TileNumber = [z: number, x: number, y: number];

const COUNT = 500;

const optimizeGeojson = (geojson: FeatureCollection, bbox: BBox) => {
  const intervalX = (bbox[2] - bbox[0]) / COUNT;
  const intervalY = (bbox[3] - bbox[1]) / COUNT;

  const grid = Array.from({ length: COUNT }, () =>
    Array.from({ length: COUNT }, () => null as GeoJSON.Feature | null),
  );

  for (const feature of geojson.features) {
    if (!feature.geometry || feature.geometry.type !== 'Point') continue;
    const [lon, lat] = feature.geometry.coordinates;

    if (lon >= bbox[0] && lon <= bbox[2] && lat >= bbox[1] && lat <= bbox[3]) {
      const xIndex = Math.floor((lon - bbox[0]) / intervalX);
      const yIndex = Math.floor((lat - bbox[1]) / intervalY);

      const current = grid[xIndex][yIndex];
      if (
        !current ||
        !current.properties.osmappRouteCount ||
        feature.properties.osmappRouteCount >
          current.properties.osmappRouteCount
      ) {
        grid[xIndex][yIndex] = feature;
      }
    }
  }

  const optimizedFeatures = grid
    .flat()
    .filter((f) => f !== null) as GeoJSON.Feature[];
  return {
    type: 'FeatureCollection',
    features: optimizedFeatures,
  };
};

const fetchFromDb = async ([z, x, y]: TileNumber) => {
  if (z > 12) throw new Error('Zoom 12 is maximum (with all details)');
  const isDetails = z == 12;

  const start = performance.now();

  const client = await getClient();

  const tile = await client.query(
    `SELECT tile_geojson FROM tiles_cache WHERE z = ${z} AND x = ${x} AND y = ${y}`,
  );
  if (tile.rowCount > 0) {
    console.log(
      'tiles_cache HIT',
      Math.round(performance.now() - start) + 'ms',
    );
    return tile.rows[0].tile_geojson;
  }

  const bbox = tileToBBOX([z, x, y]);
  const bboxCondition = `lon >= ${bbox[0]} AND lon <= ${bbox[2]} AND lat >= ${bbox[1]} AND lat <= ${bbox[3]}`;
  const query = isDetails
    ? `SELECT geojson FROM climbing_tiles WHERE type IN ('group', 'route') AND ${bboxCondition}`
    : `SELECT geojson FROM climbing_tiles WHERE type = 'group' AND ${bboxCondition}`;
  const result = await client.query(query);
  const geojson = {
    type: 'FeatureCollection',
    features: result.rows.map((record) => record.geojson),
  } as GeoJSON.FeatureCollection;

  console.log(
    'tiles_cache MISS',
    Math.round(performance.now() - start) + 'ms',
    result.rows.length,
  );

  const optimizedGeojson = z >= 9 ? geojson : optimizeGeojson(geojson, bbox);

  client.query(
    `INSERT INTO tiles_cache VALUES (${z}, ${x}, ${y}, $1) ON CONFLICT (z, x, y) DO NOTHING`,
    [optimizedGeojson],
  );

  return JSON.stringify(optimizedGeojson);
};

export const climbingTile = async ([z, x, y]: TileNumber) => {
  return await fetchFromDb([z, x, y]);
};
