import type { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';

export const climbingLayers: LayerSpecification[] = [
  {
    id: 'climbing-3-routes-circle',
    type: 'circle',
    source: 'climbing',
    minzoom: 19,

    filter: [
      'all',
      ['==', 'osmappType', 'node'],
      ['==', 'climbing', 'route_bottom'],
    ],
    paint: {
      'circle-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#4150a0',
        '#ea5540',
      ],
      'circle-radius': 6,
    },
  } as LayerSpecification,
  {
    id: 'climbing-3-routes',
    type: 'symbol',
    source: 'climbing',
    minzoom: 19,
    filter: [
      'all',
      ['==', 'osmappType', 'node'],
      ['==', 'climbing', 'route_bottom'],
    ],
    layout: {
      'text-padding': 2,
      'text-font': ['Noto Sans Regular'],
      'text-anchor': 'top',
      // 'icon-image': '{class}_11',
      'text-field': '{name} {climbing:grade:uiaa}',
      'text-offset': [0, 0.6],
      'text-size': 12,
      'text-max-width': 9,
    },
    paint: {
      'text-halo-blur': 0.5,
      'text-color': '#666',
      'text-halo-width': 1,
      'text-halo-color': '#ffffff',
    },
  },

  {
    id: 'climbing-2-crags',
    type: 'symbol',
    source: 'climbing',
    minzoom: 15,
    filter: [
      'all',
      ['==', 'osmappType', 'relationPoint'],
      ['==', 'climbing', 'crag'],
    ],
    layout: {
      'text-padding': 2,
      'text-font': ['Noto Sans Regular'],
      'text-anchor': 'top',
      'icon-image': '{class}_11',
      'text-field': '{name}',
      'text-offset': [0, 0.6],
      'text-size': 12,
      'text-max-width': 9,
      'icon-optional': false,
      'icon-ignore-placement': false,
      'icon-allow-overlap': false,
      'text-ignore-placement': false,
      'text-allow-overlap': false,
      'text-optional': true,
    },
    paint: {
      'text-halo-blur': 0.5,
      'text-color': '#666',
      'text-halo-width': 1,
      'text-halo-color': '#ffffff',
    },
  },

  {
    id: 'climbing-1-areas',
    type: 'symbol',
    source: 'climbing',
    minzoom: 5,
    maxzoom: 16,
    filter: [
      'all',
      ['==', 'osmappType', 'relationPoint'],
      ['==', 'climbing', 'area'],
    ],
    layout: {
      'text-padding': 2,
      'text-font': ['Noto Sans Regular'],
      'text-anchor': 'top',
      'icon-image': '{class}_11',
      'text-field': '{name}',
      'text-offset': [0, 0.6],
      'text-size': ['interpolate', ['linear'], ['zoom'], 11.5, 14],
      // 'icon-size': 1.5,
      'text-max-width': 9,
      'icon-optional': false,
      'icon-ignore-placement': false,
      'icon-allow-overlap': false,
      'text-ignore-placement': false,
      'text-allow-overlap': false,
      'text-optional': true,
    },
    paint: {
      'text-halo-blur': 0.5,
      'text-color': '#666',
      'text-halo-width': 1,
      'text-halo-color': '#ffffff',
      'icon-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        1,
        14,
        1,
        16,
        0.5,
      ],
      'text-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        1,
        14,
        1,
        16,
        0.5,
      ],
      'text-opacity-transition': { duration: 2000 },
    },
  },
];
