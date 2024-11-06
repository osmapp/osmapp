import { LonLat } from '../../services/types';
import { Star } from '../utils/StarsContext';
import { ASTNode } from './queryWizard/ast';

type GenericOption<T extends string, U extends Object | null> = {
  type: T;
} & (U extends null ? {} : Record<T, U>);

export type GeocoderOption = GenericOption<
  'geocoder',
  {
    loading: true;
    skeleton: true;
    nonOsmObject: true;
    osmMeta: { type: string; id: number };
    center: LonLat;
    tags: Record<string, string>;
    properties?: {
      class: string | null;
      place: string | null | undefined;
      street: string | null | undefined;
      city: string | null | undefined;
      housenumber: string | null | undefined;
      streetnumber: string | null | undefined;
      osm_key: string;
      osm_value: string;
      osm_type: string;
      osm_id: string;
      name: string;
      /** Either a string or an array */
      extent: any;
    };
    geometry: {
      coordinates: LonLat;
    };
  }
>;

export type OverpassOption = GenericOption<
  'overpass',
  {
    query?: string;
    ast?: ASTNode;
    inputValue: string;
    label: string;
  }
>;

export type PresetOption = GenericOption<
  'preset',
  {
    nameSimilarity: number;
    textsByOneSimilarity: number[];
    bestMatch: number;
    presetForSearch: {
      key: string;
      name: string;
      tags: Record<string, string>;
      tagsAsOneString: string;
      texts: string[];
    };
  }
>;

export type StarOption = GenericOption<'star', Star>;

type LoaderOption = GenericOption<'loader', null>;

export type CoordsOption = GenericOption<
  'coords',
  { center: LonLat; label: string }
>;

export type OsmOption = GenericOption<
  'osm',
  {
    type: string;
    id: number;
  }
>;

/*
 * A option for the searchbox
 */
export type Option =
  | StarOption
  | CoordsOption
  | OverpassOption
  | PresetOption
  | LoaderOption
  | GeocoderOption
  | OsmOption;
