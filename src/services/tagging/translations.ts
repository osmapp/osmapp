import { fetchJson } from '../fetch';
import { Field } from './types/Fields';
import { intl } from '../intl'; // eslint-disable-line import/no-cycle
import { publishDbgObject } from '../../utils';

// https://cdn.jsdelivr.net/npm/@openstreetmap/id-tagging-schema@6.1.0/dist/translations/en.min.json
const cdnUrl = `https://cdn.jsdelivr.net/npm/@openstreetmap/id-tagging-schema`;

// TODO downloa up-to-date or use node_module?
let translations = {};
export const fetchSchemaTranslations = async () => {
  if (translations[intl.lang]) return;

  const presetsPackage = await fetchJson(`${cdnUrl}/package.json`);
  const { version } = presetsPackage;

  // this request is cached in browser
  translations = await fetchJson(
    `${cdnUrl}@${version}/dist/translations/${intl.lang}.min.json`,
  );
  publishDbgObject('schemaTranslations', translations);
};

export const mockSchemaTranslations = (mockTranslations) => {
  translations = mockTranslations;
};

export const getPresetTranslation = (key: string) =>
  translations?.[intl.lang]?.presets?.presets?.[key]?.name;

export const getPresetTermsTranslation = (key: string) =>
  translations?.[intl.lang]?.presets?.presets?.[key]?.terms;

export const getFieldTranslation = (field: Field) => {
  if (!translations) return undefined;

  if (field.label?.match(/^{.*}$/)) {
    const resolved = field.label.substr(1, field.label.length - 2);
    return translations[intl.lang].presets.fields[resolved];
  }

  // The id 169522276 is different for each intl.language :(
  // https://www.transifex.com/openstreetmap/id-editor/translate/#cs/presets/169522276?q=key%3Apresets.fields.XXX
  return translations[intl.lang].presets.fields[field.fieldKey];
};
