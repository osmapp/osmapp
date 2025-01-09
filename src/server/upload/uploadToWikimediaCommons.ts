import { ServerOsmUser } from '../osmApiAuthServer';
import type { Feature } from '../../services/types';
import { File } from './types';
import { getMediaWikiSession } from './mediawiki/mediawiki';
import { findFreeSuffix } from './utils';
import { getUploadData } from './getUploadData';
import { getPageId } from './mediawiki/getPageId';
import { claimsHelpers } from './mediawiki/claimsHelpers';

export const uploadToWikimediaCommons = async (
  user: ServerOsmUser,
  feature: Feature,
  file: File,
  lang: string,
) => {
  const password = process.env.OSMAPPBOT_PASSWORD;
  if (!password) {
    throw new Error('OSMAPPBOT_PASSWORD not set');
  }

  const session = getMediaWikiSession();
  await session.login('OsmappBot@osmapp-upload', password); // https://www.mediawiki.org/wiki/Special:BotPasswords
  // TODO use oauth bearer + no cookie jar

  const suffix = await findFreeSuffix(feature, file);
  const data = getUploadData(user, feature, file, lang, suffix);

  const uploadResult = await session.upload(
    data.filepath,
    data.filename,
    data.text,
  );
  if (uploadResult?.upload?.result !== 'Success') {
    throw new Error(`Upload failed: ${JSON.stringify(uploadResult)}`);
  }

  const title = `File:${uploadResult?.upload.filename}`;
  const pageId = await getPageId(title);
  if (!pageId) {
    throw new Error(
      `Page not found: ${title}, uploadResult: ${JSON.stringify(uploadResult)}`,
    );
  }

  const claims = [
    claimsHelpers.createCopyrightLicense(),
    claimsHelpers.createCopyrightStatus(),
    claimsHelpers.createDate(data.date),
    claimsHelpers.createPlaceLocation(data.placeLocation),
    claimsHelpers.createPhotoLocation(data.photoLocation),
  ];
  const claimsResult = await session.editClaims(`M${pageId}`, claims);
  if (claimsResult.success !== 1) {
    throw new Error(`Claims failed: ${JSON.stringify(claimsResult)}`);
  }

  return {
    title,
    uploadResult,
    claimsResult,
  };

  // TODO check duplicate by sha1 before upload
  // MD5 hash wikidata https://commons.wikimedia.org/w/index.php?title=File%3AArea_needs_fixing-Syria_map.png&diff=801153548&oldid=607140167
};
