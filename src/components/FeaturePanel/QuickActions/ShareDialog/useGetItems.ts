import { useFeatureContext } from '../../../utils/FeatureContext';
import { useMapStateContext } from '../../../utils/MapStateContext';
import { getAppleMapsLink, getIdEditorLink } from '../../helpers/externalLinks';
import { imageAttributions, items } from './items';

// Our map uses 512 tiles, so our zoom is "one less"
// https://wiki.openstreetmap.org/wiki/Zoom_levels#Mapbox_GL
const MAPLIBREGL_ZOOM_DIFFERENCE = 1;

export const useGetItems = () => {
  const { feature } = useFeatureContext();
  const { center, roundedCenter = undefined } = feature;
  const position = roundedCenter ?? center;

  const { view, activeLayers } = useMapStateContext();
  const [lon, lat] = position;

  const [ourZoom] = view;
  const zoom = parseFloat(ourZoom) + MAPLIBREGL_ZOOM_DIFFERENCE;
  const zoomInt = Math.round(zoom);

  const osmQuery = feature?.osmMeta?.id
    ? `${feature.osmMeta.type}/${feature.osmMeta.id}`
    : `?mlat=${lat}&mlon=${lon}&zoom=${zoomInt}`;

  return {
    imageAttributions,
    items: items({
      position,
      osmQuery,
      zoomInt,
      appleMaps: getAppleMapsLink(feature, position, activeLayers),
      idEditor: getIdEditorLink(feature, view), // TODO coordsFeature has random id which gets forwarded LOL
    }),
  };
};
