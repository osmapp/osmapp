export type ApiMock = {
  url: string;
  response: unknown;
};

export const WIKIDATA: ApiMock = {
  url: 'https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&format=json&entity=Q180402&origin=*',
  response: {
    claims: {
      P18: [
        {
          mainsnak: {
            snaktype: 'value',
            property: 'P18',
            hash: 'b8c57d62b58b258173175cee3615169e17927449',
            datavalue: {
              value: 'Half Dome with Eastern Yosemite Valley (50MP).jpg',
              type: 'string',
            },
            datatype: 'commonsMedia',
          },
          type: 'statement',
          id: 'q180402$A6F07363-5391-42B8-BABF-B4B7BF9D4DBC',
          rank: 'preferred',
        },
      ],
    },
  },
};

export const COMMONS_CATEGORY: ApiMock = {
  url: 'https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category%3AYosemite%20National%20Park&gcmlimit=10&gcmtype=file&prop=imageinfo&iiprop=url&iiurlwidth=410&format=json&origin=*',
  response: {
    batchcomplete: '',
    continue: {
      gcmcontinue:
        'file|35303050582050484f544f2028313039393139373931292e4a504547|78764811',
      continue: 'gcmcontinue||',
    },
    query: {
      pages: {
        '148361232': {
          pageid: 148361232,
          ns: 6,
          title:
            'File:1912 Indian Motorcycle. This two-cylinder motorcycle is thought to have been the first motorcycle in Yosemite. The driver was (ca6a33cc-1dd8-b71b-0b83-9551ada5207f).jpg',
          imagerepository: 'local',
          imageinfo: [
            {
              thumburl:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/1912_Indian_Motorcycle._This_two-cylinder_motorcycle_is_thought_to_have_been_the_first_motorcycle_in_Yosemite._The_driver_was_%28ca6a33cc-1dd8-b71b-0b83-9551ada5207f%29.jpg/410px-thumbnail.jpg',
              thumbwidth: 410,
              thumbheight: 273,
              responsiveUrls: {
                '1.5':
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/1912_Indian_Motorcycle._This_two-cylinder_motorcycle_is_thought_to_have_been_the_first_motorcycle_in_Yosemite._The_driver_was_%28ca6a33cc-1dd8-b71b-0b83-9551ada5207f%29.jpg/615px-thumbnail.jpg',
                '2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/1912_Indian_Motorcycle._This_two-cylinder_motorcycle_is_thought_to_have_been_the_first_motorcycle_in_Yosemite._The_driver_was_%28ca6a33cc-1dd8-b71b-0b83-9551ada5207f%29.jpg/820px-thumbnail.jpg',
              },
              url: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/1912_Indian_Motorcycle._This_two-cylinder_motorcycle_is_thought_to_have_been_the_first_motorcycle_in_Yosemite._The_driver_was_%28ca6a33cc-1dd8-b71b-0b83-9551ada5207f%29.jpg',
              descriptionurl:
                'https://commons.wikimedia.org/wiki/File:1912_Indian_Motorcycle._This_two-cylinder_motorcycle_is_thought_to_have_been_the_first_motorcycle_in_Yosemite._The_driver_was_(ca6a33cc-1dd8-b71b-0b83-9551ada5207f).jpg',
              descriptionshorturl:
                'https://commons.wikimedia.org/w/index.php?curid=148361232',
            },
          ],
        },
        '149319876': {
          pageid: 149319876,
          ns: 6,
          title: 'File:1916 Yosemite by George Sterling front cover.png',
          imagerepository: 'local',
          imageinfo: [
            {
              thumburl:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/1916_Yosemite_by_George_Sterling_front_cover.png/410px-1916_Yosemite_by_George_Sterling_front_cover.png',
              thumbwidth: 410,
              thumbheight: 598,
              responsiveUrls: {
                '1.5':
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/1916_Yosemite_by_George_Sterling_front_cover.png/614px-1916_Yosemite_by_George_Sterling_front_cover.png',
                '2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/1916_Yosemite_by_George_Sterling_front_cover.png/819px-1916_Yosemite_by_George_Sterling_front_cover.png',
              },
              url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/1916_Yosemite_by_George_Sterling_front_cover.png',
              descriptionurl:
                'https://commons.wikimedia.org/wiki/File:1916_Yosemite_by_George_Sterling_front_cover.png',
              descriptionshorturl:
                'https://commons.wikimedia.org/w/index.php?curid=149319876',
            },
          ],
        },
        '133422920': {
          pageid: 133422920,
          ns: 6,
          title:
            'File:339 b (?) 6 weeks old (18b4908c3f5342f0b50989504d9fd18f).jpg',
          imagerepository: 'local',
          imageinfo: [
            {
              thumburl:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/339_b_%28%3F%29_6_weeks_old_%2818b4908c3f5342f0b50989504d9fd18f%29.jpg/410px-339_b_%28%3F%29_6_weeks_old_%2818b4908c3f5342f0b50989504d9fd18f%29.jpg',
              thumbwidth: 410,
              thumbheight: 254,
              responsiveUrls: {
                '1.5':
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/339_b_%28%3F%29_6_weeks_old_%2818b4908c3f5342f0b50989504d9fd18f%29.jpg/615px-339_b_%28%3F%29_6_weeks_old_%2818b4908c3f5342f0b50989504d9fd18f%29.jpg',
                '2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/339_b_%28%3F%29_6_weeks_old_%2818b4908c3f5342f0b50989504d9fd18f%29.jpg/820px-339_b_%28%3F%29_6_weeks_old_%2818b4908c3f5342f0b50989504d9fd18f%29.jpg',
              },
              url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/339_b_%28%3F%29_6_weeks_old_%2818b4908c3f5342f0b50989504d9fd18f%29.jpg',
              descriptionurl:
                'https://commons.wikimedia.org/wiki/File:339_b_(%3F)_6_weeks_old_(18b4908c3f5342f0b50989504d9fd18f).jpg',
              descriptionshorturl:
                'https://commons.wikimedia.org/w/index.php?curid=133422920',
            },
          ],
        },
        '78764872': {
          pageid: 78764872,
          ns: 6,
          title: 'File:500px photo (109919449).jpeg',
          imagerepository: 'local',
          imageinfo: [
            {
              thumburl:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/500px_photo_%28109919449%29.jpeg/410px-500px_photo_%28109919449%29.jpeg',
              thumbwidth: 410,
              thumbheight: 308,
              responsiveUrls: {
                '1.5':
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/500px_photo_%28109919449%29.jpeg/615px-500px_photo_%28109919449%29.jpeg',
                '2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/500px_photo_%28109919449%29.jpeg/820px-500px_photo_%28109919449%29.jpeg',
              },
              url: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/500px_photo_%28109919449%29.jpeg',
              descriptionurl:
                'https://commons.wikimedia.org/wiki/File:500px_photo_(109919449).jpeg',
              descriptionshorturl:
                'https://commons.wikimedia.org/w/index.php?curid=78764872',
            },
          ],
        },
        '78764874': {
          pageid: 78764874,
          ns: 6,
          title: 'File:500px photo (109919463).jpeg',
          imagerepository: 'local',
          imageinfo: [
            {
              thumburl:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/500px_photo_%28109919463%29.jpeg/410px-500px_photo_%28109919463%29.jpeg',
              thumbwidth: 410,
              thumbheight: 308,
              responsiveUrls: {
                '1.5':
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/500px_photo_%28109919463%29.jpeg/615px-500px_photo_%28109919463%29.jpeg',
                '2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/500px_photo_%28109919463%29.jpeg/820px-500px_photo_%28109919463%29.jpeg',
              },
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/500px_photo_%28109919463%29.jpeg',
              descriptionurl:
                'https://commons.wikimedia.org/wiki/File:500px_photo_(109919463).jpeg',
              descriptionshorturl:
                'https://commons.wikimedia.org/w/index.php?curid=78764874',
            },
          ],
        },
        '78764885': {
          pageid: 78764885,
          ns: 6,
          title: 'File:500px photo (109919597).jpeg',
          imagerepository: 'local',
          imageinfo: [
            {
              thumburl:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/500px_photo_%28109919597%29.jpeg/410px-500px_photo_%28109919597%29.jpeg',
              thumbwidth: 410,
              thumbheight: 308,
              responsiveUrls: {
                '1.5':
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/500px_photo_%28109919597%29.jpeg/615px-500px_photo_%28109919597%29.jpeg',
                '2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/500px_photo_%28109919597%29.jpeg/820px-500px_photo_%28109919597%29.jpeg',
              },
              url: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/500px_photo_%28109919597%29.jpeg',
              descriptionurl:
                'https://commons.wikimedia.org/wiki/File:500px_photo_(109919597).jpeg',
              descriptionshorturl:
                'https://commons.wikimedia.org/w/index.php?curid=78764885',
            },
          ],
        },
        '78764884': {
          pageid: 78764884,
          ns: 6,
          title: 'File:500px photo (109919623).jpeg',
          imagerepository: 'local',
          imageinfo: [
            {
              thumburl:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/500px_photo_%28109919623%29.jpeg/410px-500px_photo_%28109919623%29.jpeg',
              thumbwidth: 410,
              thumbheight: 308,
              responsiveUrls: {
                '1.5':
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/500px_photo_%28109919623%29.jpeg/615px-500px_photo_%28109919623%29.jpeg',
                '2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/500px_photo_%28109919623%29.jpeg/820px-500px_photo_%28109919623%29.jpeg',
              },
              url: 'https://upload.wikimedia.org/wikipedia/commons/3/36/500px_photo_%28109919623%29.jpeg',
              descriptionurl:
                'https://commons.wikimedia.org/wiki/File:500px_photo_(109919623).jpeg',
              descriptionshorturl:
                'https://commons.wikimedia.org/w/index.php?curid=78764884',
            },
          ],
        },
        '78764888': {
          pageid: 78764888,
          ns: 6,
          title: 'File:500px photo (109919633).jpeg',
          imagerepository: 'local',
          imageinfo: [
            {
              thumburl:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/500px_photo_%28109919633%29.jpeg/410px-500px_photo_%28109919633%29.jpeg',
              thumbwidth: 410,
              thumbheight: 308,
              responsiveUrls: {
                '1.5':
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/500px_photo_%28109919633%29.jpeg/615px-500px_photo_%28109919633%29.jpeg',
                '2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/500px_photo_%28109919633%29.jpeg/820px-500px_photo_%28109919633%29.jpeg',
              },
              url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/500px_photo_%28109919633%29.jpeg',
              descriptionurl:
                'https://commons.wikimedia.org/wiki/File:500px_photo_(109919633).jpeg',
              descriptionshorturl:
                'https://commons.wikimedia.org/w/index.php?curid=78764888',
            },
          ],
        },
        '78764887': {
          pageid: 78764887,
          ns: 6,
          title: 'File:500px photo (109919637).jpeg',
          imagerepository: 'local',
          imageinfo: [
            {
              thumburl:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/500px_photo_%28109919637%29.jpeg/410px-500px_photo_%28109919637%29.jpeg',
              thumbwidth: 410,
              thumbheight: 547,
              responsiveUrls: {
                '1.5':
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/500px_photo_%28109919637%29.jpeg/615px-500px_photo_%28109919637%29.jpeg',
                '2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/500px_photo_%28109919637%29.jpeg/820px-500px_photo_%28109919637%29.jpeg',
              },
              url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/500px_photo_%28109919637%29.jpeg',
              descriptionurl:
                'https://commons.wikimedia.org/wiki/File:500px_photo_(109919637).jpeg',
              descriptionshorturl:
                'https://commons.wikimedia.org/w/index.php?curid=78764887',
            },
          ],
        },
        '78764889': {
          pageid: 78764889,
          ns: 6,
          title: 'File:500px photo (109919659).jpeg',
          imagerepository: 'local',
          imageinfo: [
            {
              thumburl:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/500px_photo_%28109919659%29.jpeg/410px-500px_photo_%28109919659%29.jpeg',
              thumbwidth: 410,
              thumbheight: 547,
              responsiveUrls: {
                '1.5':
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/500px_photo_%28109919659%29.jpeg/615px-500px_photo_%28109919659%29.jpeg',
                '2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/500px_photo_%28109919659%29.jpeg/820px-500px_photo_%28109919659%29.jpeg',
              },
              url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/500px_photo_%28109919659%29.jpeg',
              descriptionurl:
                'https://commons.wikimedia.org/wiki/File:500px_photo_(109919659).jpeg',
              descriptionshorturl:
                'https://commons.wikimedia.org/w/index.php?curid=78764889',
            },
          ],
        },
      },
    },
  },
};

export const COMMONS_FILE: ApiMock = {
  url: 'https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&iiurlwidth=410&format=json&titles=File%3AHlubo%C4%8Depsk%C3%A9%20plotny%20-%20Prav%C3%A1%20plotna.jpg&origin=*',
  response: {
    batchcomplete: '',
    query: {
      pages: {
        '145779916': {
          pageid: 145779916,
          ns: 6,
          title: 'File:Hlubočepské plotny - Pravá plotna.jpg',
          imagerepository: 'local',
          imageinfo: [
            {
              thumburl:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg/410px-Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg',
              thumbwidth: 410,
              thumbheight: 314,
              responsiveUrls: {
                '1.5':
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg/615px-Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg',
                '2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg/820px-Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg',
              },
              url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg',
              descriptionurl:
                'https://commons.wikimedia.org/wiki/File:Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg',
              descriptionshorturl:
                'https://commons.wikimedia.org/w/index.php?curid=145779916',
            },
          ],
        },
      },
    },
  },
};

export const FODY: ApiMock = {
  url: 'https://osm.fit.vutbr.cz/fody/api/close?lat=50.0995841&lon=14.304877&limit=1&distance=50',
  response: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [14.30481, 50.09958],
        },
        properties: {
          id: 25530,
          author: 'Milancer',
          ref: 'AB030',
          tags: 'pesi:;rozcestnik:',
          created: '2019-11-10 15:19:18',
          enabled: 't',
          distance: 4.80058345,
        },
      },
    ],
  },
};

export const MAPILLARY: ApiMock = {
  url: 'https://graph.mapillary.com/images?access_token=MLY|4742193415884187|44e43b57d0211d8283a7ca1c3e6a63f2&fields=compass_angle,computed_geometry,geometry,captured_at,thumb_1024_url,thumb_original_url,is_pano&bbox=14.4208535,50.0870654,14.421653500000001,50.0878654',
  response: {
    data: [
      {
        compass_angle: 194.02419996262,
        computed_geometry: {
          type: 'Point',
          coordinates: [14.421551089998, 50.087565349226],
        },
        geometry: {
          type: 'Point',
          coordinates: [14.421551089998, 50.087565349226],
        },
        captured_at: 1717141124911,
        thumb_1024_url: 'xxx',
        thumb_original_url: 'xxx',
        is_pano: false,
        id: '375719495494059',
      },
      {
        compass_angle: 269.9,
        computed_geometry: {
          type: 'Point',
          coordinates: [14.421366352906, 50.087320707947],
        },
        geometry: {
          type: 'Point',
          coordinates: [14.421424469965, 50.087293650001],
        },
        captured_at: 1448281422000,
        thumb_1024_url: 'xxx',
        thumb_original_url: 'xxx',
        is_pano: false,
        id: '903876213766215',
      },
      {
        compass_angle: 343.14147579344,
        computed_geometry: {
          type: 'Point',
          coordinates: [14.421627585298, 50.087494303731],
        },
        geometry: {
          type: 'Point',
          coordinates: [14.421633830556, 50.087523947222],
        },
        captured_at: 1584100010500,
        thumb_1024_url: 'mapillary_url_1024',
        thumb_original_url: 'mapillary_url_original',
        is_pano: true,
        id: '321151246189360',
      },
    ],
  },
};
