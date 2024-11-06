import { fetchJson } from '../../../services/fetch';
import { isValidLayerUrl } from '../helpers';

export type Category =
  | 'photo'
  | 'map'
  | 'historicmap'
  | 'osmbasedmap'
  | 'historicphoto'
  | 'qa'
  | 'elevation'
  | 'other';

export interface LayerIndexAttribution {
  url?: string;
  text?: string;
  html?: string;
  required?: boolean;
}

export interface LayerIndex {
  /**
   * A unique identifier for the source; used in imagery_used changeset tag
   */
  id: string;
  bbox?: number[][];
  type: 'tms' | 'wms';
  /**
   * A URL template for imagery tilesA URL template for imagery tiles
   */
  url: string;
  /**
   * The name of the imagery source
   */
  name: string;
  /**
   * Whether the imagery name should be translated
   */
  i18n?: boolean;
  /**
   * A rough categorisation of different types of layers. See https://github.com/osmlab/editor-layer-index/blob/gh-pages/CONTRIBUTING.md#categories for a description of the individual categories.
   */
  category?: Category;
  min_zoom?: number;
  max_zoom?: number;
  /**
   * explicit/implicit permission by the owner for use in OSM
   */
  permission_osm?: 'explicit' | 'implicit' | 'no';
  /**
   * A URL for the license or permissions for the imagery
   */
  license_url?: string;
  /**
   * A URL for the privacy policy of the operator or false if there is no existing privacy policy for tis imagery.
   */
  privacy_policy_url?: false | string;
  /**
   * A short English-language description of the source
   */
  description?: string;
  /**
   * The ISO 3166-1 alpha-2 two letter country code in upper case. Use ZZ for unknown or multiple.
   */
  country_code?: string;
  /**
   * Whether this imagery should be shown in the default world-wide menu
   */
  default?: boolean;
  /**
   * Whether this imagery is the best source for the region
   */
  best?: boolean;
  /*
   * The age of the oldest imagery or data in the source, as an RFC3339 date or leading portion of one
   */
  start_date?: string;
  /**
   * The age of the newest imagery or data in the source, as an RFC3339 date or leading portion of one
   */
  end_date?: string;
  /**
   * HTTP header to check for information if the tile is invalid
   */
  no_tile_header?: Record<string, string[] | null>;
  /**
   * `true` if tiles are transparent and can be overlaid on another source
   */
  overlay?: boolean;
  available_projections?: string[];
  attribution?: LayerIndexAttribution;
  /**
   * A URL for an image, that can be displayed in the list of imagery layers next to the name
   */
  icon?: string;
  /**
   *A link to an EULA text that has to be accepted by the user, before the imagery source is added. Can contain {lang} to be replaced by a current user language wiki code (like FR:) or an empty string for the default English text.
   */
  eula?: string;
  /**
   * A URL for an image, that is displayed in the mapview for attribution
   */
  'logo-image'?: string;
  /**
   * Customized text for the terms of use link (default is \"Background Terms of Use\")
   */
  'terms-of-use-text'?: string;
  /**
   * Specify a checksum for tiles, which aren't real tiles. `type` is the digest type and can be MD5, SHA-1, SHA-256, SHA-384 and SHA-512, value is the hex encoded checksum in lower case. To create a checksum save the tile as file and upload it to e.g. https://defuse.ca/checksums.htm.
   */
  'no-tile-checksum'?: string;
  /**
   * header-name attribute specifies a header returned by tile server, that will be shown as `metadata-key` attribute in Show Tile Info dialog
   */
  'metadata-header'?: string;
  /**
   * Set to `true` if imagery source is properly aligned and does not need imagery offset adjustments. This is used for OSM based sources too.
   */
  'valid-georeference'?: boolean;
  /**
   * Size of individual tiles delivered by a TMS service
   */
  'tile-size'?: number;
  /**
   * Whether tiles status can be accessed by appending /status to the tile URL and can be submitted for re-rendering by appending /dirty.
   */
  'mod-tile-features'?: string;
  /**
   * HTTP headers to be sent to server. It has two attributes header-name and header-value. May be specified multiple times.
   */
  'custom-http-headers'?: {
    'header-name'?: string;
    'header-value'?: string;
  };
}

type Coordinate = [number, number];

const getBoundingBox = (coords: Coordinate[]) => [
  Math.min(...coords.map(([x]) => x)),
  Math.min(...coords.map(([, x]) => x)),
  Math.max(...coords.map(([x]) => x)),
  Math.max(...coords.map(([, x]) => x)),
];

export async function loadLayer() {
  const response = await fetchJson(
    'https://osmlab.github.io/editor-layer-index/imagery.geojson',
  );

  return response.features
    .map(({ properties, geometry }) => {
      const coordinates = (
        geometry && geometry.coordinates ? geometry.coordinates : undefined
      ) as Coordinate[][] | undefined;

      const boxes = coordinates?.map(getBoundingBox);

      return {
        ...properties,
        bbox: boxes,
        url: properties.url
          .replace('{proj}', 'EPSG:3857')
          .replace('{width}', '256')
          .replace('{height}', '256')
          .replace('{bbox}', '{bbox-epsg-3857}'),
      };
    })
    .filter(({ type, available_projections }) => {
      if (type === 'tms') {
        return true;
      }
      return (
        type === 'wms' && (available_projections ?? []).includes('EPSG:3857')
      );
    })
    .filter(({ url }) => isValidLayerUrl(url, false)) as LayerIndex[];
}
