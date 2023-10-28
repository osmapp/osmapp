import { Feature } from '../types';
import { getFieldTranslation, getPresetTranslation } from './translations';
import { getPresetForFeature } from './presets';
import { fields } from './data';
import { computeAllFieldKeys, getValueForField } from './fields';
import { Preset } from './types/Presets';
import { publishDbgObject } from '../../utils';
import { getShortId } from '../helpers';

// TODO move to shared place
const featuredKeys0 = [
  'website',
  'contact:website',
  'phone',
  'contact:phone',
  'contact:mobile',
  'opening_hours',
  'description',
  'fhrs:id',
  // wikipedia or wikidata is added dynamically
  // more ideas in here, run in browser: Object.values(dbg.fields).filter(f=>f.universal)
];

const deduplicate = (strings: string[]) => Array.from(new Set(strings));

const matchFieldsFromPreset = (
  preset: Preset,
  keysTodo: any,
  feature: Feature,
): any => {
  const computedAllFieldKeys = computeAllFieldKeys(preset);
  publishDbgObject('computedAllFieldKeys', computedAllFieldKeys);

  return computedAllFieldKeys
    .map((fieldKey: string) => {
      const field = fields[fieldKey];
      const key = field?.key;
      const keys = field?.keys;
      const shouldWeIncludeThisField =
        keysTodo.has(key) || keysTodo.hasAny(keys);
      if (!shouldWeIncludeThisField) {
        return undefined;
      }
      if (field.type === 'typeCombo') {
        keysTodo.remove(field.key); // ignores eg. railway=tram_stop on public_transport=stop_position
        return undefined;
      }

      const value = feature.tags[key];

      const keysInField = deduplicate([
        ...(field.keys ?? []),
        ...(field.key ? [field.key] : []),
      ]);
      const tagsForField = [];
      keysInField.forEach((k) => {
        if (feature.tags[k]) {
          tagsForField.push({ key: k, value: feature.tags[k] });
        }
        keysTodo.remove(k); // remove all "address:*" keys etc.
      });

      const fieldTranslation = getFieldTranslation(field);

      return {
        key,
        value: getValueForField(field, fieldTranslation, value, tagsForField),
        field,
        tagsForField,
        fieldTranslation,
        label: fieldTranslation?.label ?? field.label,
      };
    })
    .filter((field) => field?.value);
};

const matchRestToFields = (keysTodo: KeysTodo, feature: Feature) =>
  keysTodo.mapOrSkip((key) => {
    // const field =
    //   key === "ref"
    //     ? fields.ref
    //     : Object.values(fields).find(
    //     (f) => f.key === key || f.keys?.includes(key)
    //     ); // todo cache this

    // if more fielas are matching, select the one which has fieldKey equal key
    const matchingFields = Object.values(fields).filter(
      (f) => f.key === key || f.keys?.includes(key),
    );
    const field =
      matchingFields.find((f) => f.fieldKey === key) ?? matchingFields[0];
    if (matchingFields.length > 1) {
      // eslint-disable-next-line no-console
      console.warn(
        `More fields matching key ${key}: ${matchingFields.map(
          (f) => f.fieldKey,
        )}`,
      );
    }

    if (!field) {
      return undefined;
    }
    if (field.type === 'typeCombo') {
      keysTodo.remove(field.key); // ignores eg. railway=tram_stop on public_transport=stop_position
      return undefined;
    }

    const value = feature.tags[key];

    const keysInField = deduplicate([
      ...(field.keys ?? []),
      ...(field.key ? [field.key] : []),
    ]);
    const tagsForField = [];
    keysInField.forEach((k) => {
      if (feature.tags[k]) {
        tagsForField.push({ key: k, value: feature.tags[k] });
      }
      keysTodo.remove(k); // remove all "address:*" keys etc.
    });

    const fieldTranslation = getFieldTranslation(field);

    return {
      key,
      value: getValueForField(field, fieldTranslation, value, tagsForField),
      field,
      tagsForField,
      fieldTranslation,
      label: fieldTranslation?.label ?? field.label ?? `[${key}]`,
    };
  });

type KeysTodo = typeof keysTodo;
const keysTodo = {
  state: [],
  init(feature) {
    this.state = Object.keys(feature.tags).filter(
      (key) => !featuredKeys0.includes(key),
    );
  },
  resolveTags(tags) {
    Object.keys(tags).forEach((key) => this.remove(key));
  },
  has(key) {
    return this.state.includes(key);
  },
  hasAny(keys) {
    return keys?.some((key) => this.state.includes(key));
  },
  remove(key) {
    const index = this.state.indexOf(key);
    if (index > -1) {
      this.state.splice(index, 1);
    }
  },
  resolveFields(fieldsArray) {
    fieldsArray.forEach((field) => {
      if (field?.field?.key) {
        this.remove(field.field.key);
      }
      if (field?.field?.keys) {
        field.field.keys.forEach((key) => this.remove(key));
      }
    });
  },
  mapOrSkip<T>(fn: (key: string) => T): NonNullable<T>[] {
    const skippedFields = [];
    const output = [];

    while (this.state.length) {
      const field = this.state.shift();
      const result = fn(field); // this can remove items from this.state
      if (result) {
        output.push(result);
      } else {
        skippedFields.push(field);
      }
    }

    this.state = skippedFields;
    return output;
  },
};

const getFeaturedTags = (feature: Feature) => {
  const { tags } = feature;

  const featuredKeys = [
    ...featuredKeys0,
    ...(tags.wikipedia ? ['wikipedia'] : tags.wikidata ? ['wikidata'] : []),
  ];
  return featuredKeys.reduce((acc, key) => {
    if (tags[key]) {
      acc[key] = tags[key];
    }
    return acc;
  }, {});
};

export const getSchemaForFeature = (feature: Feature) => {
  const preset = getPresetForFeature(feature);

  keysTodo.init(feature);
  keysTodo.resolveTags(preset.tags); // remove tags which are already covered by Preset keys
  keysTodo.remove('name'); // always rendered by FeaturePanel

  const featuredTags = getFeaturedTags(feature);
  keysTodo.resolveTags(featuredTags);

  const matchedFields = matchFieldsFromPreset(preset, keysTodo, feature);
  keysTodo.resolveFields(matchedFields);

  const tagsWithFields = matchRestToFields(keysTodo, feature);
  keysTodo.resolveFields(tagsWithFields);

  return {
    presetKey: preset.presetKey,
    preset,
    feature,
    label: getPresetTranslation(preset.presetKey),
    featuredTags: Object.entries(featuredTags),
    matchedFields,
    tagsWithFields,
    keysTodo: keysTodo.state,
  };
};

export const addSchemaToFeature = (feature: Feature) => {
  let schema;
  try {
    schema = getSchemaForFeature(feature); // TODO forward lang here ?? maybe full intl?
  } catch (e) {
    // TODO sentry
    console.error(`getSchemaForFeature(${getShortId(feature.osmMeta)}):`, e); // eslint-disable-line no-console
    return feature;
  }

  return { ...feature, schema };
};
