import { getImagesFromCenter } from './images/getImageDefs';
import { Feature, LonLatRounded, OsmType } from './types';

export const getCoordsFeature = ([lon, lat]: LonLatRounded): Feature => {
  const center = [lon, lat].map(parseFloat);
  return {
    type: 'Feature',
    point: true,
    roundedCenter: [lon, lat],
    center,
    osmMeta: {
      type: `coordsFeature-${Math.random()}` as OsmType, // used as react key for EditDialog, ObjectsAround etc. (id must be empty)
      id: 0,
    },
    tags: {},
    properties: { class: 'marker', subclass: 'point' },
    imageDefs: getImagesFromCenter({}, center),
  };
};
