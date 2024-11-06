import * as fetchModule from '../../../../../services/fetch';
import { requestLines } from '../requestRoutes';

jest.mock('../../../../../services/fetch', () => ({
  fetchJson: jest.fn(),
}));

test('conversion', async () => {
  jest.spyOn(fetchModule, 'fetchJson').mockResolvedValue({
    elements: [
      {
        type: 'relation',
        id: 6818857,
        members: [],
        tags: {
          colour: '#880088',
          ref: '89',
          route_master: 'bus',
          type: 'route_master',
        },
      },
      {
        type: 'relation',
        id: 68352,
        bounds: {},
        members: [],
        tags: {
          ref: '89',
          route: 'bus',
          type: 'route',
        },
      },
      {
        type: 'relation',
        id: 4673219,
        bounds: {},
        members: [],
        tags: {
          ref: '89',
          route: 'bus',
          type: 'route',
        },
      },
    ],
  });

  const features = await requestLines('node', 3862767512);

  expect(features.routes.length).toBe(1);
  expect(features.routes[0].colour).toBe('#880088');
  expect(features.routes[0].osmId).toBe('6818857');
  expect(features.routes[0].osmType).toBe('relation');
  expect(features.routes[0].ref).toBe('89');
  expect(features.routes[0].service).toBe('bus');
  expect(features.routes[0].tags).toEqual({
    colour: '#880088',
    ref: '89',
    route_master: 'bus',
    type: 'route_master',
  });
  expect(Array.isArray(features.routes[0].routes)).toBe(true);

  expect(features.geoJson.features).toEqual([
    {
      center: undefined,
      geometry: {
        geometries: [],
        type: 'GeometryCollection',
      },
      id: 683524,
      osmMeta: {
        id: 68352,
        type: 'relation',
      },
      properties: {
        class: 'bus',
        osmappType: 'relation',
        ref: '89',
        route: 'bus',
        service: 'bus',
        subclass: 'bus',
        type: 'route',
      },
      tags: {
        ref: '89',
        route: 'bus',
        type: 'route',
      },
      type: 'Feature',
    },
    {
      center: undefined,
      geometry: {
        geometries: [],
        type: 'GeometryCollection',
      },
      id: 46732194,
      osmMeta: {
        id: 4673219,
        type: 'relation',
      },
      properties: {
        class: 'bus',
        osmappType: 'relation',
        ref: '89',
        route: 'bus',
        service: 'bus',
        subclass: 'bus',
        type: 'route',
      },
      tags: {
        ref: '89',
        route: 'bus',
        type: 'route',
      },
      type: 'Feature',
    },
  ]);
});
