import type { Feature } from '../../../services/types';

import { getUploadData } from '../getUploadData';
import { File } from '../types';

const feature: Feature = {
  type: 'Feature',
  center: [14.5255208, 50.5776264],
  osmMeta: {
    type: 'way',
    id: 255654888,
  },
  tags: {
    amenity: 'place_of_worship',
    name: 'svatý Mikuláš',
    wikidata: 'Q15393875',
    wikipedia: 'cs:Kostel svatého Mikuláše (Drchlava)',
  },
  properties: {
    class: 'place_of_worship',
    subclass: 'place_of_worship',
  },
  countryCode: 'cz',
  schema: {
    presetKey: 'amenity/place_of_worship/christian',
    label: 'Christian Church',
  } as unknown as Feature['schema'],
  parentFeatures: [
    {
      tags: {
        climbing: 'whatever',
        name: 'ClimbingCragName',
      },
    } as unknown as Feature,
  ],
};

const file: File = {
  filepath: '/tmp/cda0f39b9e13dc5cd1ea4cb07',
  filename: 'IMG_4424.jpg',
  location: [14.525191666666668, 50.577450000000006],
  date: new Date('2024-03-16T11:35:56.000Z'),
};

const user = { id: 162287, username: 'zby-cz' };

const lang = 'en';

const out = {
  date: '2024-03-16T11:35:56Z',
  filename: 'ClimbingCragName, svatý Mikuláš (Christian Church) - OsmAPP.jpg',
  filepath: '/tmp/cda0f39b9e13dc5cd1ea4cb07',
  photoLocation: [14.525191666666668, 50.577450000000006],
  placeLocation: [14.5255208, 50.5776264],
  text: expect.anything(),
};

//language=html
const outDescription = `
=={{int:filedesc}}==
{{Information
    |description    = {{en|1=ClimbingCragName, svatý Mikuláš (Christian Church)}}
    |date           = 2024-03-16T11:35:56Z
    |source         = {{Own photo}}
    |author         = OpenStreetMap user [https://www.openstreetmap.org/user/zby-cz#id=162287 zby-cz]
    |other_fields =
        {{Information field
          |name  = {{Label|P1259|link=-|capitalization=ucfirst}}
          |value = {{#property:P1259|from=M{{PAGEID}} }}&nbsp;[[File:OOjs UI icon edit-ltr-progressive.svg |frameless |text-top |10px |link={{fullurl:{{FULLPAGENAME}}}}#P1259|alt=Edit this on Structured Data on Commons|Edit this on Structured Data on Commons]]
        }}
        {{Information field
          |name  = {{Label|P9149|link=-|capitalization=ucfirst}}
          |value = {{#property:P9149|from=M{{PAGEID}} }}&nbsp;[[File:OOjs UI icon edit-ltr-progressive.svg |frameless |text-top |10px |link={{fullurl:{{FULLPAGENAME}}}}#P9149|alt=Edit this on Structured Data on Commons|Edit this on Structured Data on Commons]]
        }}
        {{OSMLink |type=way |OSM_ID=255654888 }}
        {{Information field |name= OsmAPP |value= https://osmapp.org/way/255654888 }}
    }}

=={{int:license-header}}==
{{Self|cc-by-sa-4.0|author=OpenStreetMap user [https://www.openstreetmap.org/user/zby-cz#id=162287 zby-cz]}}
{{FoP-Czech_Republic}}
`;

test('getUploadData', () => {
  const wikiapiUploadRequest = getUploadData(user, feature, file, lang, '');
  expect(wikiapiUploadRequest).toEqual(out);
  expect(wikiapiUploadRequest.text.trim()).toEqual(outDescription.trim());
});
