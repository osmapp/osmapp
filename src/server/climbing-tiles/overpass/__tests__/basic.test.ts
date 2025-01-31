const elements = [
  // OsmElement[]
  // {
  //     "type": "node",
  //     "id": 313822575,
  //     "lat": 50.0547464,
  //     "lon": 14.4056821,
  //     "tags": {
  //         "climbing:boulder": "yes",
  //         "climbing:toprope": "yes",
  //         "leisure": "sports_centre",
  //         "name": "SmíchOFF",
  //         "opening_hours": "Mo 07:00-23:00; Tu-Th 07:00-23:30; Fr 07:00-23:00; Sa,Su 08:00-23:00",
  //         "sport": "climbing",
  //         "website": "https://www.lezeckecentrum.cz/"
  //     }
  // },
  {
    type: 'node',
    id: 11580052710,
    lat: 49.6600391,
    lon: 14.2573987,
    tags: {
      climbing: 'route_bottom',
      'climbing:grade:uiaa': '9-',
      name: 'Lída',
      sport: 'climbing',
      wikimedia_commons: 'File:Roviště - Hafty2.jpg',
      'wikimedia_commons:2': 'File:Roviště - Hafty3.jpg',
      'wikimedia_commons:2:path':
        '0.273,0.904|0.229,0.566B|0.317,0.427B|0.433,0.329B|0.515,0.21B|0.526,0.126B|0.495,0.075A',
      'wikimedia_commons:path':
        '0.67,0.601|0.66,0.442B|0.682,0.336B|0.739,0.236B|0.733,0.16B|0.72,0.1B|0.688,0.054A',
    },
  },
  {
    type: 'relation',
    id: 17130663,
    members: [
      {
        type: 'node',
        ref: 11580052710,
        role: '',
      },
    ],
    tags: {
      climbing: 'crag',
      name: 'Yosemite (Hafty)',
      site: 'climbing',
      sport: 'climbing',
      type: 'site',
      wikimedia_commons: 'File:Roviště - Hafty.jpg',
      'wikimedia_commons:10': 'File:Roviště - Hafty10.jpg',
      'wikimedia_commons:2': 'File:Roviště - Hafty2.jpg',
      'wikimedia_commons:3': 'File:Roviště - Hafty3.jpg',
      'wikimedia_commons:4': 'File:Roviště - Hafty4.jpg',
      'wikimedia_commons:5': 'File:Roviště - Hafty5.jpg',
      'wikimedia_commons:6': 'File:Roviště - Hafty6.jpg',
      'wikimedia_commons:7': 'File:Roviště - Hafty7.jpg',
      'wikimedia_commons:8': 'File:Roviště - Hafty8.jpg',
      'wikimedia_commons:9': 'File:Roviště - Hafty9.jpg',
    },
  },
  {
    type: 'relation',
    id: 17130099,
    members: [
      {
        type: 'relation',
        ref: 17130663,
        role: '',
      },
    ],
    tags: {
      climbing: 'area',
      description:
        'Roviště je klasická vltavská žula. Jedná se o velmi vyhlášenou oblast. Nabízí cesty prakticky všech obtížností, zpravidla dobře odjištěné.',
      name: 'Roviště',
      site: 'climbing',
      type: 'site',
      website: 'https://www.horosvaz.cz/skaly-sektor-289/',
      'website:2': 'https://www.lezec.cz/pruvodcx.php?key=5',
    },
  },

  // two nodes and a climbing=route way
  {
    type: 'node',
    id: 1,
    lat: 50,
    lon: 14,
    tags: {},
  },
  {
    type: 'node',
    id: 2,
    lat: 51,
    lon: 15,
    tags: {},
  },
  {
    type: 'way',
    id: 3,
    nodes: [1, 2],
    tags: {
      climbing: 'route',
      name: 'Route of type way starting on 14,50',
    },
  },

  // two nodes and natural=cliff way ("crag")
  {
    type: 'node',
    id: 4,
    lat: 52,
    lon: 16,
    tags: {},
  },
  {
    type: 'node',
    id: 5,
    lat: 53,
    lon: 17,
    tags: {},
  },
  {
    type: 'way',
    id: 6,
    nodes: [4, 5],
    tags: {
      natural: 'cliff',
      name: 'Cliff of type way at 16.5,52.5',
    },
  },
];

test('noop', () => {});
