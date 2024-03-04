import type { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';

// originaly from basicStyle
export const cliffsLayers: LayerSpecification[] = [
  {
    id: 'Cliffs base',
    type: 'line',
    source: 'maptiler_planet',
    layout: {
      'line-cap': 'butt',
      'line-join': 'miter',
      'line-miter-limit': 2,
      visibility: 'visible',
    },
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 15, 0.3, 22, 1],
      'line-gap-width': 0,
      'line-offset': 0,
      'line-blur': 0,
      'line-color': [
        'interpolate',
        ['linear'],
        ['zoom'],
        13,
        'hsla(0, 0%, 50%, 0.5)',
        17,
        'hsl(0,0%,58%)',
      ],
    },
    filter: ['==', ['geometry-type'], 'LineString'],
    'source-layer': 'mountain_peak',
    minzoom: 7,
    maxzoom: 22,
  },
  {
    id: 'Cliffs ticks 0-18',
    type: 'line',
    source: 'maptiler_planet',
    layout: {
      'line-cap': 'butt',
      'line-join': 'miter',
      'line-miter-limit': 2,
      visibility: 'visible',
    },
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 16, 2, 22, 10],
      'line-gap-width': 0,
      'line-offset': ['interpolate', ['linear'], ['zoom'], 16, 1.2, 22, 5],
      'line-blur': 0,
      'line-color': [
        'interpolate',
        ['linear'],
        ['zoom'],
        13,
        'hsla(0, 0%, 50%, 0.3)',
        17,
        'hsla(0, 0%, 50%, 0.8)',
      ],
      'line-dasharray': [0.1, 2],
    },
    filter: ['==', ['geometry-type'], 'LineString'],
    'source-layer': 'mountain_peak',
    minzoom: 7,
    maxzoom: 18,
  },
  {
    id: 'Cliffs ticks 18-22',
    type: 'line',
    source: 'maptiler_planet',
    layout: {
      'line-cap': 'butt',
      'line-join': 'miter',
      'line-miter-limit': 2,
      visibility: 'visible',
    },
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 16, 2, 22, 10],
      'line-gap-width': 0,
      'line-offset': ['interpolate', ['linear'], ['zoom'], 16, 1.2, 22, 5],
      'line-blur': 0,
      'line-color': [
        'interpolate',
        ['linear'],
        ['zoom'],
        13,
        'hsla(0, 0%, 50%, 0.3)',
        17,
        'hsla(0, 0%, 50%, 0.8)',
      ],
      'line-dasharray': [0.1, 1],
    },
    filter: ['==', ['geometry-type'], 'LineString'],
    'source-layer': 'mountain_peak',
    minzoom: 18,
    maxzoom: 22,
  },
];
