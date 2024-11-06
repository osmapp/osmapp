import type Vocabulary from '../locales/vocabulary';
import type { getSchemaForFeature } from './tagging/idTaggingScheme';
import type { Polygon } from 'geojson';

export type OsmType = 'node' | 'way' | 'relation';
export type OsmId = {
  type: OsmType;
  id: number;
};

export type PathType = { x: number; y: number; suffix: string }[];
export type MemberPath = {
  path: PathType;
  member: Feature;
};
export type ImageDefFromTag = {
  type: 'tag';
  k: string;
  v: string;
  instant: boolean; // true = no API call needed
  path?: PathType;
  memberPaths?: MemberPath[]; // merged on relation
};
export type ImageDefFromCenter = {
  type: 'center';
  service: 'mapillary' | 'fody' | 'kartaview' | 'panoramax';
  center: LonLat;
};
export type ImageDef = ImageDefFromTag | ImageDefFromCenter;
export const isCenter = (def: ImageDef): def is ImageDefFromCenter =>
  def?.type === 'center';
export const isTag = (def: ImageDef): def is ImageDefFromTag =>
  def?.type === 'tag';
export const isInstant = (def: ImageDef): def is ImageDefFromTag =>
  isTag(def) && def.instant;

// coordinates in geojson format: [lon, lat] = [x,y]
export type LonLat = number[];
export type LonLatRounded = string[];
export type Position = LonLat; // TODO merge those two types
export type PositionBoth = LonLat | LonLatRounded;

export interface Point {
  type: 'Point';
  coordinates: Position;
}

export interface LineString {
  type: 'LineString';
  coordinates: Position[];
}

export interface GeometryCollection {
  type: 'GeometryCollection';
  geometries: Array<Point | LineString | GeometryCollection | Polygon>;
}

export type FeatureGeometry = Point | LineString | GeometryCollection | Polygon;

export const isPoint = (geometry: FeatureGeometry): geometry is Point =>
  geometry?.type === 'Point';
export const isLineString = (
  geometry: FeatureGeometry,
): geometry is LineString => geometry?.type === 'LineString';
export const isGeometryCollection = (
  geometry: FeatureGeometry,
): geometry is GeometryCollection => geometry?.type === 'GeometryCollection';
export const isPolygon = (geometry: FeatureGeometry): geometry is Polygon =>
  geometry?.type === 'Polygon';

export type FeatureTags = {
  [key: string]: string;
};

type RelationMember = {
  type: OsmType;
  ref: number;
  role: string;
};

// TODO split in two types /extend/
export interface Feature {
  point?: boolean; // TODO rename to isMarker or isCoords
  type: 'Feature';
  id?: number; // for map hover effect
  geometry?: FeatureGeometry;
  osmMeta: {
    type: OsmType;
    id: number;
    visible?: string;
    version?: number;
    changeset?: number;
    timestamp?: string;
    user?: string;
    uid?: number;
    lat?: string;
    lon?: string;
    role?: string; // only for memberFeatures
  };
  tags: FeatureTags;
  members?: RelationMember[];
  memberFeatures?: Feature[];
  parentFeatures?: Feature[];
  imageDefs?: ImageDef[];
  properties: {
    class: string;
    subclass: string;
    [key: string]: string | number | boolean;
    osmappRouteCount?: number;
    osmappHasImages?: boolean;
    osmappType?: 'node' | 'way' | 'relation';
    osmappLabel?: string;
  };
  center: Position;
  countryCode?: string; // ISO3166-1 code, undefined = no country
  roundedCenter?: LonLatRounded;
  error?: 'network' | 'unknown' | '404' | '500'; // etc.
  deleted?: boolean;
  schema?: ReturnType<typeof getSchemaForFeature>; // undefined means error

  // skeleton
  layer?: { id: string };
  source?: string;
  sourceLayer?: string;
  state?: { hover: boolean };
  skeleton?: boolean; // that means loading is in progress
  nonOsmObject?: boolean;
}

export type MessagesType = typeof Vocabulary;
export type TranslationId = keyof MessagesType;

export type SuccessInfo = {
  type: 'note' | 'edit';
  text: string;
  url: string;
  redirect?: string;
};
