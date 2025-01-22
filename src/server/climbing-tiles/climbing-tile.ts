import vtpbf from 'vt-pbf';
import geojsonVt from 'geojson-vt';
import { BBox } from 'geojson';
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

const fetchFromDb = async ([z, x, y]: TileNumber) => {
  const start = performance.now();

  const client = await getClient();

  const bbox = tileToBBOX([z, x, y]);

  const query =
    z < 10
      ? `SELECT geojson FROM climbing_tiles WHERE type='group' AND lon >= ${bbox[0]} AND lon <= ${bbox[2]} AND lat >= ${bbox[1]} AND lat <= ${bbox[3]}`
      : `SELECT geojson FROM climbing_tiles WHERE type IN ('group', 'route') AND lon >= ${bbox[0]} AND lon <= ${bbox[2]} AND lat >= ${bbox[1]} AND lat <= ${bbox[3]}`;
  const result = await client.query(query);
  const geojson = {
    type: 'FeatureCollection',
    features: result.rows.map((record) => record.geojson),
  } as GeoJSON.FeatureCollection;
  console.log('fetchFromDb', performance.now() - start, result.rows.length);

  return geojson;
};

export const climbingTile = async ([z, x, y]: TileNumber, type: string) => {
  if (type === 'json') {
    const orig = await fetchFromDb([z, x, y]);
    return JSON.stringify(orig);
  }

  const orig = await fetchFromDb([z, x, y]);

  const tileindex = geojsonVt(orig, { tolerance: 0 });
  const tile = tileindex.getTile(z, x, y);
  return tile ? vtpbf.fromGeojsonVt({ groups: tile }) : null;
};
