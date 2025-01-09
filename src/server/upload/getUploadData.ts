import { ServerOsmUser } from '../osmApiAuthServer';
import type { Feature } from '../../services/types';
import { File } from './types';
import { getName } from '../../helpers/featureLabel';
import { getFilename, getTitle } from './utils';
import {
  getFullOsmappLink,
  getOsmappLink,
  getUrlOsmId,
} from '../../services/helpers';
import { PROJECT_ID } from '../../services/project';

const getOsmappUrls = (feature: Feature) => {
  const osmappUrl = `https://osmapp.org${getOsmappLink(feature)}`;
  const openclimbingUrl = `https://openclimbing.org${getOsmappLink(feature)}`;

  if (feature.tags.climbing) {
    return `${osmappUrl}<br>${openclimbingUrl}`;
  } else {
    return `${osmappUrl}`;
  }
};

export const getUploadData = (
  user: ServerOsmUser,
  feature: Feature,
  file: File,
  lang: string,
  suffix: string,
) => {
  const name = getName(feature);
  // const presetKey = feature.schema.presetKey;
  const title = getTitle(feature, file);
  const filename = getFilename(feature, file, suffix);
  const osmUserUrl = `https://www.openstreetmap.org/user/${user.username}#id=${user.id}`;
  const date = file.date.toISOString().replace(/\.\d+Z$/, 'Z');
  const osmappUrls = getOsmappUrls(feature);

  // TODO construct description (categories)
  // TODO  each file must belong to at least one category that describes its content or function
  // TODO  get category based on location eg

  // TODO get from list https://commons.wikimedia.org/wiki/Commons:Freedom_of_panorama#Summary_table
  const fop =
    feature.countryCode === 'cz'
      ? '{{FoP-Czech_Republic}}'
      : feature.countryCode === 'de'
        ? '{{FoP-Germany}}'
        : '';

  // TODO add some overpass link https://www.wikidata.org/w/index.php?title=Template:Overpasslink&action=edit
  const text = `
=={{int:filedesc}}==
{{Information
  |description  = {{${lang}|1=${title}}}
  |date         = ${date}
  |source       = {{Own photo}}
  |author       = OpenStreetMap user [${osmUserUrl} ${user.username}]
  |other_fields =
    {{OSMLink |type=${feature.osmMeta.type} |OSM_ID=${feature.osmMeta.id} }}
    {{Information field |name= OsmAPP |value= ${osmappUrls} }}
}}
{{Location}}
{{Object location}}

=={{int:license-header}}==
{{Self|cc-by-sa-4.0|author=OpenStreetMap user [${osmUserUrl} ${user.username}]}}
${fop}
`;

  // TODO choose correct FOP based on country: https://commons.wikimedia.org/wiki/Category:FoP_templates
  // TODO https://commons.wikimedia.org/wiki/Template:Geograph_from_structured_data

  return {
    filepath: file.filepath,
    filename,
    text,
    date,
    photoLocation: file.location,
    placeLocation: feature.center,
  };
};
