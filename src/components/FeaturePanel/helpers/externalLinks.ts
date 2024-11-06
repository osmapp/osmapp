import { getLabel } from '../../../helpers/featureLabel';
import { Feature, PositionBoth } from '../../../services/types';
import { View } from '../../utils/MapStateContext';

export const getIdEditorLink = (feature: Feature, view?: View) => {
  const query = feature?.osmMeta?.id
    ? `?${feature.osmMeta.type}=${feature.osmMeta.id}`
    : '';
  const hash = view ? `#map=${view.join('/')}` : '';
  return `https://www.openstreetmap.org/edit${query}${hash}`;
};

export const getAppleMapsLink = (
  feature: Feature,
  position: PositionBoth,
  activeLayers: string[],
) => {
  // TODO: satelite detection on userLayers
  const layer = activeLayers.some((layer) =>
    ['sat', 'bingSat', 'cuzkSat'].includes(layer),
  )
    ? 'h' // satelite
    : 'm'; // normal

  const markerLabel = getLabel(feature);
  return `https://maps.apple.com/?ll=${position[1]},${position[0]}&t=${layer}&q=${markerLabel}`;
};
