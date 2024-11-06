import { useEffect } from 'react';
import { getGlobalMap } from '../../../../services/mapStorage';
import { GeoJSONSource } from 'maplibre-gl';
import { getBgColor } from './LineNumber';

const SOURCE_NAME = 'publictransport';
const COLOR_ATTRIBUTE = 'mapColor';

const getPublictransportSource = () => {
  const map = getGlobalMap();
  if (!map) {
    return undefined;
  }

  if (map.getSource(SOURCE_NAME)) {
    return map.getSource<GeoJSONSource>(SOURCE_NAME);
  }

  map.addSource(SOURCE_NAME, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  });
  map.addLayer({
    id: `${SOURCE_NAME}-lines`,
    type: 'line',
    source: SOURCE_NAME,
    paint: {
      'line-color': ['get', COLOR_ATTRIBUTE],
      'line-width': 4,
    },
  });

  return map.getSource<GeoJSONSource>(SOURCE_NAME);
};

export const useShowOnMap = (
  routes: GeoJSON.FeatureCollection,
  visiblCategories: string[],
) => {
  useEffect(() => {
    const source = getPublictransportSource();
    if (!routes || !source) {
      return;
    }

    const filteredRoutes = routes.features
      .filter(({ properties }) => visiblCategories.includes(properties.service))
      .map((route) => ({
        ...route,
        properties: {
          ...route.properties,
          // The light mode color has very low contrast
          [COLOR_ATTRIBUTE]: getBgColor(route.properties.colour, true),
        },
      }));

    source.setData({ type: 'FeatureCollection', features: filteredRoutes });
    return () => {
      source.setData({ type: 'FeatureCollection', features: [] });
    };
  }, [routes, visiblCategories]);
};
