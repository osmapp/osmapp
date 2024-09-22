import { Feature } from '../services/types';
import { roundedToDeg } from '../utils';
import { intl, t } from '../services/intl';
import { buildAddress } from '../services/helpers';

const getBuiltAddress = (feature: Feature) => {
  return buildAddress(feature.tags, feature.center);
};

export const getSubclass = ({ layer, osmMeta, properties, schema }: Feature) =>
  schema?.label ||
  properties.subclass?.replace(/_/g, ' ') ||
  (layer && layer.id) || // layer.id specified only when maplibre-gl skeleton displayed
  osmMeta.type;

const getRefLabel = (feature: Feature) =>
  feature.tags.ref ? `${getSubclass(feature)} ${feature.tags.ref}` : '';

const getName = ({ tags }: Feature) => tags[`name:${intl.lang}`] || tags.name;

export const hasName = (feature: Feature) =>
  feature.point || getName(feature) || getBuiltAddress(feature); // we dont want to show "No name" for point

export const getHumanPoiType = (feature: Feature) =>
  hasName(feature) ? getSubclass(feature) : t('featurepanel.no_name');

export const getLabel = (feature: Feature) => {
  const { point, roundedCenter } = feature;
  if (point) {
    return roundedToDeg(roundedCenter);
  }

  return (
    getName(feature) ||
    getRefLabel(feature) ||
    getBuiltAddress(feature) ||
    getSubclass(feature) // generic label like "Recycling point"
  );
};

export const getParentLabel = (feature: Feature) => {
  const firstParentWithName = feature.parentFeatures?.find(hasName);
  const parent = firstParentWithName ?? feature.parentFeatures?.[0];

  return parent ? getLabel(parent) : '';
};
