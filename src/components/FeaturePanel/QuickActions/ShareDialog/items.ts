import { isIOS } from '../../../../helpers/platforms';
import { t } from '../../../../services/intl';
import { PositionBoth } from '../../../../services/types';
import { isMobileDevice } from '../../../helpers';

type ImageAttribution = {
  href: string;
  label: string;
};

export const imageAttributions: ImageAttribution[] = [
  {
    href: 'https://commons.wikimedia.org/wiki/File:Openstreetmap_logo.svg',
    label: 'Wikimedia Commons (OpenStreetMap)',
  },
  {
    href: 'https://commons.wikimedia.org/wiki/File:AppleMaps_logo.svg',
    label: 'wikimedia Commons (Apple)',
  },
  {
    href: 'https://commons.wikimedia.org/wiki/File:Google_Maps_icon_(2020).svg',
    label: 'wikimedia Commons (Google)',
  },
];

type ExternalMapLink = {
  label: string;
  href: string;
  image?: string;
};

export const items = ({
  osmQuery,
  appleMaps,
  idEditor,
  position: [lon, lat],
  zoomInt,
}: {
  osmQuery: string;
  appleMaps: string;
  idEditor: string;
  position: PositionBoth;
  zoomInt: number;
}): ExternalMapLink[] => [
  {
    label: 'OpenStreetMap.org',
    href: `https://openstreetmap.org/${osmQuery}`,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/b/b0/Openstreetmap_logo.svg',
  },
  ...(isIOS()
    ? [
        {
          label: 'Apple maps',
          href: appleMaps,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/1/17/AppleMaps_logo.svg',
        },
      ]
    : []),
  {
    label: 'Google Maps',
    href: `https://google.com/maps/search/${lat}%C2%B0%20${lon}%C2%B0/@${lat},${lon},${zoomInt}z`,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg',
  },
  {
    label: 'Mapy.cz',
    href: `https://mapy.cz/zakladni?q=${lat}%C2%B0%20${lon}%C2%B0`,
  },
  ...(isMobileDevice()
    ? [
        {
          label: t('coordinates.geo_uri'),
          href: `geo:${lat},${lon}`,
        },
      ]
    : []),
  {
    label: 'OpenStreetMap.cz',
    href: `https://openstreetmap.cz/${osmQuery}`,
  },
  {
    label: 'iD editor',
    href: idEditor,
  },
];
