import { getImageFromApiRaw } from '../getImageFromApi';
import * as fetchModule from '../../fetch';
import {
  ApiMock,
  COMMONS_CATEGORY,
  COMMONS_FILE,
  FODY,
  MAPILLARY,
  WIKIDATA,
} from './apiMocks.fixture';

jest.mock('../../fetch', () => ({
  fetchJson: jest.fn(),
}));
jest.mock('maplibre-gl', () => ({}));

const mockApi = (mock: ApiMock) => {
  jest.spyOn(fetchModule, 'fetchJson').mockImplementation((url) => {
    expect(url).toEqual(mock.url);
    return Promise.resolve(mock.response);
  });
};

beforeEach(() => {
  jest.restoreAllMocks();
  expect.hasAssertions();
});

test('ImageFromCenter - mapillary', async () => {
  mockApi(MAPILLARY);
  expect(
    await getImageFromApiRaw({
      type: 'center',
      service: 'mapillary',
      center: [14.4212535, 50.0874654],
    }),
  ).toEqual([
    {
      description: 'Mapillary image from 3/13/2020, 11:46:50 AM',
      imageUrl: 'mapillary_url_1024',
      link: '321151246189360',
      linkUrl:
        'https://www.mapillary.com/app/?focus=photo&pKey=321151246189360',
      uncertainImage: true,
      panoramaUrl: 'mapillary_url_original',
    },
  ]);
});

test('ImageFromCenter - fody', async () => {
  mockApi(FODY);
  expect(
    await getImageFromApiRaw({
      type: 'center',
      service: 'fody',
      center: [14.304877, 50.0995841],
    }),
  ).toEqual([
    {
      description: 'Fody photodb from Milancer (2019-11-10 15:19:18)',
      imageUrl: 'https://osm.fit.vutbr.cz/fody/files/250px/25530.jpg',
      link: 25530,
      linkUrl: 'https://osm.fit.vutbr.cz/fody/?id=25530',
    },
  ]);
});

test('wikidata=*', async () => {
  mockApi(WIKIDATA);
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'wikidata',
      v: 'Q180402',
      instant: false,
    }),
  ).toEqual([
    {
      description: 'Wikidata image (wikidata=*)',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Half_Dome_with_Eastern_Yosemite_Valley_(50MP).jpg/410px-Half_Dome_with_Eastern_Yosemite_Valley_(50MP).jpg',
      link: 'Q180402',
      linkUrl: 'https://www.wikidata.org/wiki/Q180402',
    },
  ]);
});

test('image=File:', async () => {
  mockApi(COMMONS_FILE);
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'image',
      v: 'File:Hlubočepské plotny - Pravá plotna.jpg',
      instant: false,
    }),
  ).toEqual([
    {
      description: 'Wikimedia Commons (image=*)',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Hlubočepské_plotny_-_Pravá_plotna.jpg/410px-Hlubočepské_plotny_-_Pravá_plotna.jpg',
      link: 'File:Hlubočepské plotny - Pravá plotna.jpg',
      linkUrl: 'https://commons.wikimedia.org/w/index.php?curid=145779916',
    },
  ]);
});

test('wikimedia_commons=File:', async () => {
  mockApi(COMMONS_FILE);
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'wikimedia_commons',
      v: 'File:Hlubočepské plotny - Pravá plotna.jpg',
      instant: false,
    }),
  ).toEqual([
    {
      description: 'Wikimedia Commons (wikimedia_commons=*)',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Hlubočepské_plotny_-_Pravá_plotna.jpg/410px-Hlubočepské_plotny_-_Pravá_plotna.jpg',
      link: 'File:Hlubočepské plotny - Pravá plotna.jpg',
      linkUrl: 'https://commons.wikimedia.org/w/index.php?curid=145779916',
    },
  ]);
});

test('wikimedia_commons=Category:', async () => {
  mockApi(COMMONS_CATEGORY);
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'wikimedia_commons',
      v: 'Category:Yosemite National Park',
      instant: false,
    }),
  ).toEqual([
    {
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/500px_photo_(109919449).jpeg/410px-500px_photo_(109919449).jpeg',
      description: 'Wikimedia Commons category (wikimedia_commons=*)',
      link: 'Category:Yosemite National Park',
      linkUrl:
        'https://commons.wikimedia.org/wiki/Category:Yosemite National Park',
    },
    {
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/500px_photo_(109919463).jpeg/410px-500px_photo_(109919463).jpeg',
      description: 'Wikimedia Commons category (wikimedia_commons=*)',
      link: 'Category:Yosemite National Park',
      linkUrl:
        'https://commons.wikimedia.org/wiki/Category:Yosemite National Park',
    },
    {
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/500px_photo_(109919623).jpeg/410px-500px_photo_(109919623).jpeg',
      description: 'Wikimedia Commons category (wikimedia_commons=*)',
      link: 'Category:Yosemite National Park',
      linkUrl:
        'https://commons.wikimedia.org/wiki/Category:Yosemite National Park',
    },
    {
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/500px_photo_(109919597).jpeg/410px-500px_photo_(109919597).jpeg',
      description: 'Wikimedia Commons category (wikimedia_commons=*)',
      link: 'Category:Yosemite National Park',
      linkUrl:
        'https://commons.wikimedia.org/wiki/Category:Yosemite National Park',
    },
    {
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/500px_photo_(109919637).jpeg/410px-500px_photo_(109919637).jpeg',
      description: 'Wikimedia Commons category (wikimedia_commons=*)',
      link: 'Category:Yosemite National Park',
      linkUrl:
        'https://commons.wikimedia.org/wiki/Category:Yosemite National Park',
    },
    {
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/500px_photo_(109919633).jpeg/410px-500px_photo_(109919633).jpeg',
      description: 'Wikimedia Commons category (wikimedia_commons=*)',
      link: 'Category:Yosemite National Park',
      linkUrl:
        'https://commons.wikimedia.org/wiki/Category:Yosemite National Park',
    },
    {
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/500px_photo_(109919659).jpeg/410px-500px_photo_(109919659).jpeg',
      description: 'Wikimedia Commons category (wikimedia_commons=*)',
      link: 'Category:Yosemite National Park',
      linkUrl:
        'https://commons.wikimedia.org/wiki/Category:Yosemite National Park',
    },
    {
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/339_b_(%3F)_6_weeks_old_(18b4908c3f5342f0b50989504d9fd18f).jpg/410px-339_b_(%3F)_6_weeks_old_(18b4908c3f5342f0b50989504d9fd18f).jpg',
      description: 'Wikimedia Commons category (wikimedia_commons=*)',
      link: 'Category:Yosemite National Park',
      linkUrl:
        'https://commons.wikimedia.org/wiki/Category:Yosemite National Park',
    },
    {
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/1912_Indian_Motorcycle._This_two-cylinder_motorcycle_is_thought_to_have_been_the_first_motorcycle_in_Yosemite._The_driver_was_(ca6a33cc-1dd8-b71b-0b83-9551ada5207f).jpg/410px-thumbnail.jpg',
      description: 'Wikimedia Commons category (wikimedia_commons=*)',
      link: 'Category:Yosemite National Park',
      linkUrl:
        'https://commons.wikimedia.org/wiki/Category:Yosemite National Park',
    },
    {
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/1916_Yosemite_by_George_Sterling_front_cover.png/410px-1916_Yosemite_by_George_Sterling_front_cover.png',
      description: 'Wikimedia Commons category (wikimedia_commons=*)',
      link: 'Category:Yosemite National Park',
      linkUrl:
        'https://commons.wikimedia.org/wiki/Category:Yosemite National Park',
    },
  ]);
});
