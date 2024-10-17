import { useEditContext } from '../EditContext';
import { getFields } from '../../../../services/tagging/fields';
import { getFieldTranslation } from '../../../../services/tagging/translations';
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { FeatureTags } from '../../../../services/types';
import { Field } from '../../../../services/tagging/types/Fields';
import { t } from '../../../../services/intl';
import { allPresets } from '../../../../services/tagging/data';
import { Preset } from '../../../../services/tagging/types/Presets';
import styled from '@emotion/styled';
import { OpeningHoursEditor } from './OpeningHoursEditor/OpeningHoursEditor';

const StyledFormControl = styled(FormControl)`
  margin-top: 16px;
  margin-bottom: 8px;
`;

const getInitialActiveFields = (
  fields: Field[],
  tags: FeatureTags,
): Field[] => {
  const activeFields = [];
  fields.forEach((field: Field) => {
    if (tags[field.key]) {
      activeFields.push(field);
    }
  });

  return activeFields;
};

const FieldsEditorInner = ({ preset }: { preset: Preset }) => {
  const { tags, setTag } = useEditContext().tags;

  const { fields, moreFields, universalFields } = getFields(preset); // TODO
  const [activeFields, setActiveFields] = useState(() =>
    getInitialActiveFields(fields, tags),
  );
  const inactiveFields = fields.filter(
    ({ fieldKey }) => !activeFields.some((f) => f.fieldKey === fieldKey),
  );

  return (
    <>
      {activeFields.map((field) => {
        const fieldKey = field.fieldKey;
        const fieldTranslation = getFieldTranslation(field);
        const label = `${fieldTranslation?.label ?? `[${fieldKey}]`} – fieldkey:${fieldKey} – type:${field.type}`;
        const k = field.key ?? field.keys?.[0];

        console.log({ k, label, field, fieldTranslation });

        if (fieldKey === 'opening_hours') {
          return <OpeningHoursEditor key={fieldKey} />;
        }

        if (field.type === 'combo') {
          return (
            <StyledFormControl key={fieldKey} fullWidth>
              <InputLabel shrink>{label}</InputLabel>
              <Select
                label={label}
                value={tags[k]}
                onChange={(e) => setTag(k, e.target.value)}
                displayEmpty
                variant="outlined"
              >
                {Object.entries(fieldTranslation.options ?? {}).map(
                  ([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ),
                )}
              </Select>
            </StyledFormControl>
          );
        }

        if (field.type === 'semiCombo') {
          const values = tags[k]?.split(';') ?? [];
          return (
            <StyledFormControl key={fieldKey} fullWidth>
              <InputLabel shrink>{label}</InputLabel>
              <Select
                label={label}
                multiple
                value={values}
                onChange={(e) =>
                  setTag(k, (e.target.value as string[]).join(';'))
                }
                renderValue={(selected) => selected.join(', ')}
                displayEmpty
                fullWidth
                variant="outlined"
              >
                {field.options?.map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={values.includes(option)} />
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          );
        }

        return (
          <div key={fieldKey}>
            <TextField
              label={label}
              value={tags[k]}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              margin="normal"
              name={k}
              onChange={(e) => setTag(e.target.name, e.target.value)}
              fullWidth
              // autoFocus={focusTag === k}
            />
          </div>
        );
      })}

      {!!inactiveFields.length && (
        <>
          <Typography variant="body1" component="span" color="textSecondary">
            {t('editdialog.add_major_tag')}:
          </Typography>
          {inactiveFields.map((field) => {
            const fieldTranslation = getFieldTranslation(field);
            const label = fieldTranslation?.label ?? `[${field.fieldKey}]`;

            return (
              <React.Fragment key={field.fieldKey}>
                {' '}
                <Button
                  size="small"
                  onClick={() => setActiveFields((arr) => [...arr, field])}
                >
                  {label}
                </Button>
              </React.Fragment>
            );
          })}
        </>
      )}
      <br />
      <br />
    </>
  );
};

export const FieldsEditor = () => {
  const { presetKey } = useEditContext();

  // TODO remove condition
  if (!presetKey) {
    return null;
  }

  const preset = allPresets[presetKey];
  if (!preset) {
    return null;
  }

  return <FieldsEditorInner preset={preset} />;
};
