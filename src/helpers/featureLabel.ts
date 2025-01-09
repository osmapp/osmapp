import { Feature } from '../services/types';
import { roundedToDeg } from '../utils';
import { intl, t } from '../services/intl';
import { buildAddress, getUrlOsmId } from '../services/helpers';

const getBuiltAddress = (feature: Feature) => {
  return buildAddress(feature.tags, feature.center);
};

export const getTypeLabel = ({ layer, osmMeta, properties, schema }: Feature) =>
  schema?.label ||
  properties.subclass?.replace(/_/g, ' ') ||
  (layer && layer.id) || // layer.id specified only when maplibre-gl skeleton displayed
  osmMeta.type;

const getRefLabel = (feature: Feature) =>
  feature.tags.ref ? `${getTypeLabel(feature)} ${feature.tags.ref}` : '';

export const getName = ({ tags }: Feature) =>
  tags[`name:${intl.lang}`] || tags.name;

export const hasName = (feature: Feature) =>
  feature.point || getName(feature) || getBuiltAddress(feature); // we dont want to show "No name" for point

export const getHumanPoiType = (feature: Feature) =>
  hasName(feature) ? getTypeLabel(feature) : t('featurepanel.no_name');

export const getLabelWithoutFallback = (feature: Feature) => {
  const { point, roundedCenter } = feature;
  if (point) {
    return roundedToDeg(roundedCenter);
  }

  return getName(feature) || getRefLabel(feature) || getBuiltAddress(feature);
};

export const getLabel = (feature: Feature) =>
  getLabelWithoutFallback(feature) ||
  getTypeLabel(feature) || // generic label like "Recycling point"
  getUrlOsmId(feature.osmMeta);

export const getSecondaryLabel = (feature: Feature) => {
  const { point, tags } = feature;
  if (point) {
    return undefined;
  }

  const { name } = tags;
  return name === getLabel(feature) ? undefined : name;
};

export const getParentLabel = (feature: Feature) => {
  const parentWithName = feature.parentFeatures?.find(
    (parent) => getName(parent) && parent.tags.climbing,
  );

  return parentWithName ? getLabel(parentWithName) : '';
};
