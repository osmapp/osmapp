import {
  FeatureGeometry,
  GeometryCollection,
  isGeometryCollection,
  isLineString,
  isPoint,
  isPolygon,
  Position,
} from './types';

export type NamedBbox = {
  w: number;
  s: number;
  e: number;
  n: number;
};

export const getBbox = (coordinates: Position[]): NamedBbox => {
  const [firstX, firstY] = coordinates[0];
  const initialBbox = { w: firstX, s: firstY, e: firstX, n: firstY };

  return coordinates.reduce(
    ({ w, s, e, n }, [x, y]) => ({
      w: Math.min(w, x),
      s: Math.min(s, y),
      e: Math.max(e, x),
      n: Math.max(n, y),
    }),
    initialBbox,
  );
};

const getCenterOfBbox = (points: Position[]) => {
  if (!points.length) return undefined;

  const { w, s, e, n } = getBbox(points); // [WSEN]
  const lon = (w + e) / 2; // flat earth rulezz
  const lat = (s + n) / 2;
  return [lon, lat];
};

const getPointsRecursive = (geometry: GeometryCollection): Position[] =>
  geometry.geometries.flatMap((subGeometry) => {
    if (isGeometryCollection(subGeometry)) {
      return getPointsRecursive(subGeometry);
    }
    if (isLineString(subGeometry)) {
      return subGeometry.coordinates;
    }
    if (isPoint(subGeometry)) {
      return [subGeometry.coordinates];
    }
    return [];
  });

export const getCenter = (geometry: FeatureGeometry): Position => {
  if (isPoint(geometry)) {
    return geometry.coordinates;
  }

  if (isLineString(geometry)) {
    return getCenterOfBbox(geometry.coordinates);
  }

  if (isGeometryCollection(geometry)) {
    const allPoints = getPointsRecursive(geometry);
    return getCenterOfBbox(allPoints);
  }
  if (isPolygon(geometry)) {
    const outerCoords = geometry.coordinates[0];
    return getCenterOfBbox(outerCoords);
  }

  return undefined;
};
