import { Feature } from '../../services/types';

const getElementType = (osmType) => {
  switch (osmType) {
    case 'R':
      return 'relation';
    case 'W':
      return 'way';
    case 'N':
      return 'node';
    default:
      throw new Error(`Geocoder osm_id is invalid: ${osmType}`);
  }
};

export const getSkeleton = (option): Feature => {
  const center = option.geometry.coordinates;
  const { osm_id: id, osm_type: osmType, name } = option.properties;
  const type = getElementType(osmType);
  const [lon, lat] = center;

  return {
    type: 'Feature',
    skeleton: true,
    nonOsmObject: false,
    osmMeta: { type, id: parseInt(id, 10) },
    center: [parseFloat(lon), parseFloat(lat)],
    tags: { name },
    properties: { class: option.class, subclass: '' },
  };
};

export const onHighlightFactory = (setPreview) => (e, option) => {
  if (option?.star?.center) {
    const { center } = option.star;
    setPreview({ center });
    return;
  }

  if (option?.geometry?.coordinates) {
    setPreview(getSkeleton(option));
  }
};
