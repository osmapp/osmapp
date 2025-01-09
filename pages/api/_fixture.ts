export const exampleUploadResponse = {
  upload: {
    filename: 'File_1.jpg',
    result: 'Success',
    imageinfo: {
      url: 'https://upload.wikimedia.org/wikipedia/test/3/39/File_1.jpg',
      html: '<p>A file with this name exists already, please check <strong><a class="mw-selflink selflink">File:File 1.jpg</a></strong> if you are not sure if you want to change it.\n</p>\n<div class="thumb tright"><div class="thumbinner" style="width:182px;"><a           href="/w/index.php?title=Special:Upload&amp;wpDestFile=File_1.jpg" class="new" title="File:File 1.jpg">File:File 1.jpg</a>  <div class="thumbcaption"></div></div></div>\n',
      width: 474,
      size: 26703,
      bitdepth: 8,
      mime: 'image/jpeg',
      userid: 42588,
      mediatype: 'BITMAP',
      descriptionurl: 'https://test.wikipedia.org/wiki/File:File_1.jpg',
      extmetadata: {
        ObjectName: {
          value: 'File 1',
          hidden: '',
          source: 'mediawiki-metadata',
        },
        DateTime: {
          value: '2019-03-06 08:43:37',
          hidden: '',
          source: 'mediawiki-metadata',
        },
        // ...
      },
      comment: '',
      commonmetadata: [],
      descriptionshorturl: 'https://test.wikipedia.org/w/index.php?curid=0',
      sha1: '2ffadd0da73fab31a50407671622fd6e5282d0cf',
      parsedcomment: '',
      metadata: [
        {
          name: 'MEDIAWIKI_EXIF_VERSION',
          value: 2,
        },
      ],
      canonicaltitle: 'File:File 1.jpg',
      user: 'Mansi29ag',
      timestamp: '2019-03-06T08:43:37Z',
      height: 296,
    },
  },
};
