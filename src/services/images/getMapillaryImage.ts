import { fetchJson } from '../fetch';
import { getImageFromCenterFactory } from './getImageFromCenterFactory';

export const MAPILLARY_ACCESS_TOKEN =
  'MLY|4742193415884187|44e43b57d0211d8283a7ca1c3e6a63f2';

type MapillaryImage = {
  compass_angle: number;
  computed_geometry: {
    type: string;
    coordinates: number[];
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
  captured_at: number;
  thumb_1024_url: string;
  thumb_original_url: string;
  is_pano: boolean;
  id: string;
};

type MapillaryResponse = {
  data: MapillaryImage[];
};

export const getMapillaryImage = getImageFromCenterFactory('Mapillary', {
  getImages: async (poiCoords) => {
    // https://www.mapillary.com/developer/api-documentation/#image
    const bbox = [
      poiCoords[0] - 0.0004, // left, bottom, right, top (or minLon, minLat, maxLon, maxLat)
      poiCoords[1] - 0.0004,
      poiCoords[0] + 0.0004,
      poiCoords[1] + 0.0004,
    ];
    // consider computed_compass_angle - but it is zero for many images, so we would have to fallback to compass_angle
    const url = `https://graph.mapillary.com/images?access_token=${MAPILLARY_ACCESS_TOKEN}&fields=compass_angle,computed_geometry,geometry,captured_at,thumb_1024_url,thumb_original_url,is_pano&bbox=${bbox}`;
    const { data } = await fetchJson<MapillaryResponse>(url);
    return data;
  },
  getImageCoords: ({ computed_geometry, geometry }) =>
    computed_geometry?.coordinates ?? geometry.coordinates,
  getImageAngle: ({ compass_angle }) => compass_angle,
  isPano: ({ is_pano }) => is_pano,
  getImageUrl: ({ thumb_1024_url }) => thumb_1024_url,
  getImageDate: ({ captured_at }) => new Date(captured_at),
  getImageLink: ({ id }) => id,
  getImageLinkUrl: ({ id }) =>
    `https://www.mapillary.com/app/?focus=photo&pKey=${id}`,
  getPanoUrl: ({ thumb_original_url }) => thumb_original_url,
});
