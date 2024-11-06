export const NODE = {
  elements: [
    {
      type: 'node',
      id: 2904943126,
      lat: 50.103985,
      lon: 14.3904481,
      timestamp: '2019-03-12T18:43:45Z',
      version: 5,
      changeset: 68073678,
      user: 'b-jazz-bot',
      uid: 9451067,
      tags: {
        amenity: 'library',
      },
    },
  ],
};

export const NODE_FEATURE = {
  type: 'Feature',
  center: [14.3904481, 50.103985],
  osmMeta: {
    changeset: 68073678,
    id: 2904943126,
    timestamp: '2019-03-12T18:43:45Z',
    type: 'node',
    uid: 9451067,
    user: 'b-jazz-bot',
    version: 5,
  },
  properties: {
    class: 'library',
    subclass: 'library',
  },
  tags: {
    amenity: 'library',
  },
  imageDefs: [
    { type: 'center', service: 'panoramax', center: [14.3904481, 50.103985] },
    { type: 'center', service: 'kartaview', center: [14.3904481, 50.103985] },
    { type: 'center', service: 'mapillary', center: [14.3904481, 50.103985] },
  ],
};

export const WAY = {
  elements: [
    {
      type: 'way',
      id: 51050330,
      timestamp: '2021-05-05T06:30:57Z',
      version: 7,
      changeset: 104162807,
      user: 'zby-cz',
      uid: 162287,
      nodes: [1, 2],
      tags: { amenity: 'school' },
    },
  ],
};
export const WAY_FEATURE = {
  type: 'Feature',
  center: [14, 50],
  osmMeta: {
    changeset: 104162807,
    id: 51050330,
    timestamp: '2021-05-05T06:30:57Z',
    type: 'way',
    uid: 162287,
    user: 'zby-cz',
    version: 7,
  },
  properties: { class: 'school', subclass: 'school' },
  tags: { amenity: 'school' },
  imageDefs: [
    { type: 'center', service: 'panoramax', center: [14, 50] },
    { type: 'center', service: 'kartaview', center: [14, 50] },
    { type: 'center', service: 'mapillary', center: [14, 50] },
  ],
};
export const RELATION = {
  elements: [
    {
      type: 'relation',
      id: 3727192,
      timestamp: '2014-05-08T20:45:55Z',
      version: 1,
      changeset: 22218722,
      user: 'Salamandr',
      uid: 1708065,
      members: [
        {
          type: 'way',
          ref: 8166328,
          role: 'outer',
        },
        {
          type: 'way',
          ref: 8166329,
          role: 'inner',
        },
      ],
      tags: {
        type: 'multipolygon',
        amenity: 'university',
      },
    },
  ],
};

export const RELATION_FEATURE = {
  type: 'Feature',
  center: [15, 51],
  members: [
    {
      ref: 8166328,
      role: 'outer',
      type: 'way',
    },
    {
      ref: 8166329,
      role: 'inner',
      type: 'way',
    },
  ],
  osmMeta: {
    changeset: 22218722,
    id: 3727192,
    timestamp: '2014-05-08T20:45:55Z',
    type: 'relation',
    uid: 1708065,
    user: 'Salamandr',
    version: 1,
  },
  properties: {
    class: 'college',
    subclass: 'university',
  },
  tags: {
    amenity: 'university',
    type: 'multipolygon',
  },
  imageDefs: [
    { type: 'center', service: 'panoramax', center: [15, 51] },
    { type: 'center', service: 'kartaview', center: [15, 51] },
    { type: 'center', service: 'mapillary', center: [15, 51] },
  ],
};
