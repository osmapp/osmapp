import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Field } from '../../../services/tagging/types/Fields';
import { useToggleState } from '../../helpers';
import { buildAddress } from '../../../services/helpers';
import { Feature } from '../../../services/types';
import { t } from '../../../services/intl';
import { TagsTableInner } from './TagsTableInner';
import { EditIconButton } from '../helpers/EditIconButton';
import { useEditDialogContext } from '../helpers/EditDialogContext';
import { renderValue } from './renderValue';
import { Table } from './Table';
import { ShowMoreButton } from './helpers';
import { useFeatureContext } from '../../utils/FeatureContext';

const Spacer = styled.div`
  width: 100%;
  height: 50px;
`;

const render = (
  field: Field,
  feature: Feature,
  k,
  v,
  tagsForField,
  fieldTranslation,
): string | ReactNode => {
  if (field.type === 'address') {
    return buildAddress(feature.tags, feature.center);
  }

  if (field.fieldKey === 'wikidata') {
    return renderValue('wikidata', feature.tags.wikidata);
  }

  if (fieldTranslation?.types && fieldTranslation?.options) {
    return tagsForField.map(({ key, value: value2 }) => (
      <div key={key}>
        {fieldTranslation.types[key]}:{' '}
        {renderValue(key, fieldTranslation.options[value2]?.title)}
      </div>
    ));
  }

  if (field?.type === 'manyCombo') {
    return tagsForField.map(({ key, value: value2 }) => (
      <div key={key}>
        {fieldTranslation.options[key]}:{' '}
        {renderValue(key, fieldTranslation.options[value2]?.title ?? value2)}
      </div>
    ));
  }

  if (tagsForField?.length >= 2) {
    return (
      <>
        {tagsForField.map(({ key, value: value2 }) => (
          <div key={key}>{renderValue(key, value2)}</div>
        ))}
      </>
    );
  }

  if (!k) {
    return renderValue(tagsForField[0].key, tagsForField[0].value);
  }

  return renderValue(k, v);
};

// TODO some fields eg. oneway/bicycle doesnt have units in brackets
const unitRegExp = / \((.+)\)$/i;
const removeUnits = (label) => label.replace(unitRegExp, '');
const addUnits = (label, value: string | ReactNode) => {
  if (typeof value !== 'string') return value;
  const unit = label.match(unitRegExp);
  return `${value}${unit ? ` (${unit[1]})` : ''}`;
};

const getTooltip = (field: Field, key: string) =>
  `field: ${field.fieldKey}${key === field.fieldKey ? '' : `, key: ${key}`}`;

export const IdSchemeFields = () => {
  const { openWithTag } = useEditDialogContext();
  const [otherTagsShown, toggleOtherTagsShown] = useToggleState(false);
  const { feature } = useFeatureContext();
  const featuredTags = feature.deleted
    ? []
    : feature.schema?.featuredTags ?? [];
  const { schema } = feature;

  if (!schema) return null;
  if (!Object.keys(schema).length) return null;

  // TODO add link to osm key reference as Tooltip https://wiki.openstreetmap.org/w/api.php?action=wbgetentities&format=json&languagefallback=1&languages=en%7Ccs%7Cen-us%7Csk&origin=*&sites=wiki&titles=Locale%3Acs%7CLocale%3Aen-us%7CLocale%3Ask%7CKey%3Astart%20date%7CTag%3Astart%20date%3D1752
  // TODO preset translations https://github.com/zbycz/osmapp/issues/190

  const numberOfItems =
    featuredTags.length +
    schema.matchedFields.length +
    schema.tagsWithFields.length +
    schema.keysTodo.length;

  if (!numberOfItems) {
    return <Spacer />;
  }

  return (
    <>
      {featuredTags.length && schema.matchedFields.length ? (
        <Typography variant="overline" display="block" color="textSecondary">
          {t('featurepanel.details_heading')}
        </Typography>
      ) : null}

      <Table>
        <tbody>
          {schema.matchedFields.map(
            ({ key, value, label, field, fieldTranslation, tagsForField }) => (
              <tr key={key}>
                <th title={getTooltip(field, key)}>{removeUnits(label)}</th>
                <td>
                  <EditIconButton
                    onClick={() => openWithTag(tagsForField?.[0]?.key ?? key)}
                  />
                  {addUnits(
                    label,
                    render(
                      field,
                      feature,
                      key,
                      value,
                      tagsForField,
                      fieldTranslation,
                    ),
                  )}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </Table>

      {!!(schema.keysTodo.length + schema.tagsWithFields.length) && (
        <>
          <Table>
            <tbody>
              <tr>
                <td colSpan={2} style={{ textAlign: 'right' }}>
                  <ShowMoreButton
                    isShown={otherTagsShown}
                    onClick={toggleOtherTagsShown}
                  />
                </td>
              </tr>
              {otherTagsShown &&
                schema.tagsWithFields.map(
                  ({
                    key,
                    value,
                    label,
                    field,
                    fieldTranslation,
                    tagsForField,
                  }) => (
                    <tr key={key}>
                      <th title={getTooltip(field, key)}>
                        {removeUnits(label)}
                      </th>
                      <td>
                        <EditIconButton
                          onClick={() =>
                            openWithTag(tagsForField?.[0]?.key ?? key)
                          }
                        />
                        {render(
                          field,
                          feature,
                          key,
                          addUnits(label, value),
                          tagsForField,
                          fieldTranslation,
                        )}
                      </td>
                    </tr>
                  ),
                )}
            </tbody>
          </Table>

          {otherTagsShown && (
            <>
              <TagsTableInner
                tags={schema.keysTodo.reduce(
                  (acc, key) => ({ ...acc, [key]: feature.tags[key] }),
                  {},
                )}
                center={feature.center}
                except={[]}
              />
            </>
          )}
        </>
      )}
    </>
  );
};
