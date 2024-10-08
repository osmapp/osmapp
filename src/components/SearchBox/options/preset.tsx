import match from 'autosuggest-highlight/match';
import sum from 'lodash/sum';
import orderBy from 'lodash/orderBy';
import groupBy from 'lodash/groupBy';
import { diceCoefficient } from 'dice-coefficient';
import FolderIcon from '@mui/icons-material/Folder';
import { Grid, Typography } from '@mui/material';
import React from 'react';
import {
  fetchSchemaTranslations,
  getPresetTermsTranslation,
  getPresetTranslation,
} from '../../../services/tagging/translations';
import { presets } from '../../../services/tagging/data';
import { PresetOption } from '../types';
import { t } from '../../../services/intl';
import { highlightText, IconPart } from '../utils';

let presetsForSearch: {
  key: string;
  name: string;
  tags: Record<string, string>;
  tagsAsOneString: string;
  texts: string[];
}[];
const getPresetsForSearch = async () => {
  if (presetsForSearch) {
    return presetsForSearch;
  }

  await fetchSchemaTranslations();

  // resolve symlinks to {landuse...} etc
  presetsForSearch = Object.values(presets)
    .filter(({ searchable }) => searchable === undefined || searchable)
    .filter(({ locationSet }) => !locationSet?.include)
    .filter(({ tags }) => Object.keys(tags).length > 0)
    .map(({ name, presetKey, tags, terms }) => {
      const tagsAsStrings = Object.entries(tags).map(([k, v]) => `${k}=${v}`);
      return {
        key: presetKey,
        name: getPresetTranslation(presetKey) ?? name ?? 'x',
        tags,
        tagsAsOneString: tagsAsStrings.join(', '),
        texts: [
          ...(getPresetTermsTranslation(presetKey) ?? terms ?? 'x').split(','),
          ...tagsAsStrings,
          presetKey,
        ],
      };
    });

  return presetsForSearch;
};

const num = (text: string, inputValue: string) =>
  // TODO match function not always good - consider text.toLowerCase().includes(inputValue.toLowerCase());
  match(text, inputValue, {
    insideWords: true,
    findAllOccurrences: true,
  }).length;

type PresetOptions = Promise<{
  before: PresetOption[];
  after: PresetOption[];
}>;

export const getPresetOptions = async (
  inputValue: string,
  threshold = 0.3,
): PresetOptions => {
  if (inputValue.length <= 2) {
    return { before: [], after: [] };
  }

  const presets = await getPresetsForSearch();
  const rawResults = presets.map((preset) => {
    const nameSimilarity = diceCoefficient(preset.name, inputValue);
    const textsByOneSimilarity = preset.texts.map((term) =>
      diceCoefficient(term, inputValue),
    );
    return {
      nameSimilarity,
      textsByOneSimilarity,
      sum: nameSimilarity * 10 + sum(textsByOneSimilarity),
      presetForSearch: preset,
    };
  });
  const grouped = groupBy(rawResults, ({ sum, nameSimilarity }) => {
    if (nameSimilarity > threshold) {
      return 'name';
    }
    if (nameSimilarity === 0 && sum > threshold) {
      return 'rest';
    }
  });

  const allResults = [
    ...orderBy(grouped.name, ({ sum }) => sum, 'desc'),
    ...orderBy(grouped.rest, ({ sum }) => sum, 'desc'),
  ].map((result) => ({
    type: 'preset' as const,
    preset: result,
  }));
  const before = allResults.slice(0, 2);
  const after = allResults.slice(2);

  return { before, after };
};

const getAdditionalText = (preset: PresetOption['preset']) => {
  const { textsByOneSimilarity } = preset;
  const highestMatching = Math.max(...textsByOneSimilarity);

  if (preset.nameSimilarity >= highestMatching) {
    return '';
  }

  const { texts } = preset.presetForSearch;
  const matchingIndex = textsByOneSimilarity.indexOf(highestMatching);
  const matchingText = texts[matchingIndex];
  return ` (${matchingText}…)`;
};

export const renderPreset = ({ preset }: PresetOption, inputValue: string) => {
  const { name } = preset.presetForSearch;
  const additionalText = getAdditionalText(preset);

  return (
    <>
      <IconPart>
        <FolderIcon />
      </IconPart>
      <Grid item xs>
        {highlightText(`${name}${additionalText}`, inputValue)}
        <Typography variant="body2" color="textSecondary">
          {t('searchbox.category')}
        </Typography>
      </Grid>
    </>
  );
};
