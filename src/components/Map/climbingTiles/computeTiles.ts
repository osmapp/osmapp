import { LngLat } from 'maplibre-gl';
import { Tile } from '../../../types';
import { publishDbgObject } from '../../../utils';

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
  const correction = 1 / Math.cos(yRad); // on pole (90°) = infinity
  const yNorm = (1 - Math.log(Math.tan(yRad) + correction) / Math.PI) / 2; // defined on 0° - 85.0511°
  const yNormBounded = Math.min(Math.max(yNorm, 0), 1);
  const maxTileMinusOne = yNormBounded === 1 ? 1 : 0;
  const y = Math.floor(yNormBounded * Math.pow(2, z)) - maxTileMinusOne;

  // TODO this won't work on wrapped coordinates around +-180°

  return { z, x, y };
};

export const computeTiles = (
  z: number,
  northWest: LngLat,
  southEast: LngLat,
): Tile[] => {
  const nwTile = getTile(z, northWest);
  const seTile = getTile(z, southEast);

  const tiles = [];
  for (let x = nwTile.x; x <= seTile.x; x++) {
    for (let y = nwTile.y; y <= seTile.y; y++) {
      tiles.push({ z, x, y });
    }
  }

  const asString = tiles.map(({ z, x, y }) => `${z}/${x}/${y}`);
  publishDbgObject('climbingTiles', asString);

  return tiles;
};
