import { isIOS } from '../../../helpers/platforms';
import { getFullOsmappLink, getShortLink } from '../../../services/helpers';
import { t } from '../../../services/intl';
import { PositionBoth } from '../../../services/types';
import { positionToDeg, positionToDM } from '../../../utils';
import { isMobileDevice } from '../../helpers';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useMapStateContext } from '../../utils/MapStateContext';
import { useSnackbar } from '../../utils/SnackbarContext';
import { getAppleMapsLink, getIdEditorLink } from '../helpers/externalLinks';

// Our map uses 512 tiles, so our zoom is "one less"
// https://wiki.openstreetmap.org/wiki/Zoom_levels#Mapbox_GL
const MAPLIBREGL_ZOOM_DIFFERENCE = 1;

type ExternalMapLink = {
  label: string;
  href: string;
};

export const useGetItems = (position: PositionBoth) => {
  const { feature } = useFeatureContext();
  const { view, activeLayers } = useMapStateContext();
  const { showToast } = useSnackbar();
  const { center, roundedCenter = undefined } = feature;
  const [ourZoom] = view;
  const [lon, lat] = position;

  const zoom = parseFloat(ourZoom) + MAPLIBREGL_ZOOM_DIFFERENCE;
  const zoomInt = Math.round(zoom);
  const osmQuery = feature?.osmMeta?.id
    ? `${feature.osmMeta.type}/${feature.osmMeta.id}`
    : `?mlat=${lat}&mlon=${lon}&zoom=${zoomInt}`;

  return {
    imageAttributions: [
      {
        href: 'https://commons.wikimedia.org/wiki/File:Azimutalprojektion-schief_kl-cropped.png',
        label: 'Wikimedia Commons (GeoURI)',
      },
      {
        href: 'https://commons.wikimedia.org/wiki/File:Openstreetmap_logo.svg',
        label: 'Wikimedia Commons (OpenStreetMap)',
      },
      {
        href: 'https://wiki.openstreetmap.org/wiki/File:ID.svg',
        label: 'OpenStreetMap Wiki (iD)',
      },
      {
        href: 'https://commons.wikimedia.org/wiki/File:AppleMaps_logo.svg',
        label: 'wikimedia Commons (Apple)',
      },
    ],
    shareItems: [
      getShortLink(feature),
      getFullOsmappLink(feature),
      positionToDeg(roundedCenter ?? center),
      positionToDM(roundedCenter ?? center),
    ],
    primaryItems: [
      ...(isMobileDevice() && !isIOS()
        ? [
            {
              image:
                'https://upload.wikimedia.org/wikipedia/commons/4/4c/Azimutalprojektion-schief_kl-cropped.png',
              label: 'GeoURI',
              href: `geo:${lat},${lon}`,
            },
          ]
        : []),
      ...(isIOS()
        ? [
            {
              image:
                'https://upload.wikimedia.org/wikipedia/commons/1/17/AppleMaps_logo.svg',
              label: 'Apple',
              href: getAppleMapsLink(feature, position, activeLayers),
            },
          ]
        : []),
      {
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Openstreetmap_logo.svg/256px-Openstreetmap_logo.svg.png?20220919103849',
        label: 'OSM',
        href: `https://openstreetmap.org/${osmQuery}`,
      },
      {
        image: '/osmapp/logo/osmapp_logo_square.svg',
        label: 'OsmAPP',
        onClick: () => {
          const url = getShortLink(feature);

          if (navigator.share) {
            navigator.share({ title: 'OsmAPP', url }).catch(() => {});
            return;
          }
          navigator.clipboard.writeText(url);
          showToast('Copied link to clipboard');
        },
      },
      ...(!isMobileDevice()
        ? [
            {
              image: 'https://wiki.openstreetmap.org/w/images/3/34/ID.svg',
              invertImage: {
                dark: true,
                light: false,
              },
              label: 'iD',
              href: getIdEditorLink(feature, view), // TODO coordsFeature has random id which gets forwarded LOL
            },
          ]
        : []),
    ],
    items: [
      {
        label: 'OpenStreetMap.org',
        href: `https://openstreetmap.org/${osmQuery}`,
      },
      {
        label: 'OpenStreetMap.cz',
        href: `https://openstreetmap.cz/${osmQuery}`,
      },
      {
        label: 'Mapy.cz',
        href: `https://mapy.cz/zakladni?q=${lat}%C2%B0%20${lon}%C2%B0`,
      },
      {
        label: 'Google Maps',
        href: `https://google.com/maps/search/${lat}%C2%B0%20${lon}%C2%B0/@${lat},${lon},${zoomInt}z`,
      },
      {
        label: 'iD editor',
        href: getIdEditorLink(feature, view), // TODO coordsFeature has random id which gets forwarded LOL
      },
      ...(isIOS()
        ? [
            {
              label: 'Apple maps',
              href: getAppleMapsLink(feature, position, activeLayers),
            },
          ]
        : []),
      ...(isMobileDevice()
        ? [
            {
              label: t('coordinates.geo_uri'),
              href: `geo:${lat},${lon}`,
            },
          ]
        : []),
    ] as ExternalMapLink[],
  };
};
