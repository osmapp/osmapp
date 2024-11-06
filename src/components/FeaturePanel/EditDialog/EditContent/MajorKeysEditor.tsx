import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { t } from '../../../../services/intl';
import {
  getNextWikimediaCommonsIndex,
  getWikimediaCommonsKey,
} from '../../Climbing/utils/photo';
import { useEditDialogContext } from '../../helpers/EditDialogContext';
import { useEditContext } from '../EditContext';
import { OpeningHoursEditor } from './OpeningHoursEditor/OpeningHoursEditor';
import styled from '@emotion/styled';
import { CharacterCount, getInputTypeForKey } from './helpers';

export const majorKeys = [
  'name',
  'description',
  'website',
  'phone',
  'opening_hours',
];

const MAX_INPUT_LENGTH = 255;

const getData = (numberOfWikimediaItems: number) => {
  const wikimediaCommonTags = Array(numberOfWikimediaItems)
    .fill('')
    .reduce((acc, _, index) => {
      const key = getWikimediaCommonsKey(index);
      const value = `Wikimedia commons photo (${index})`;
      return { ...acc, [key]: value };
    }, {});

  return {
    keys: [...majorKeys, ...Object.keys(wikimediaCommonTags)],
    names: {
      name: t('tags.name'),
      description: t('tags.description'),
      website: t('tags.website'),
      phone: t('tags.phone'),
      opening_hours: t('tags.opening_hours'),
      ...wikimediaCommonTags,
    },
  };
};

const InputContainer = styled.div`
  position: relative;
`;

type TextFieldProps = {
  k: string;
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  value?: string;
  autoFocus?: boolean;
};

const TextFieldWithCharacterCount = ({
  k,
  label,
  autoFocus,
  onChange,
  value,
}: TextFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputType = getInputTypeForKey(k);

  return (
    <InputContainer>
      <TextField
        label={label}
        type={inputType}
        multiline={inputType === 'text'}
        value={value}
        InputLabelProps={{ shrink: true }}
        variant="outlined"
        margin="normal"
        name={k}
        onChange={onChange}
        fullWidth
        autoFocus={autoFocus}
        inputProps={{ maxLength: MAX_INPUT_LENGTH }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        helperText={
          <CharacterCount
            count={value?.length}
            max={MAX_INPUT_LENGTH}
            isInputFocused={isFocused}
          />
        }
      />
    </InputContainer>
  );
};

export const MajorKeysEditor = () => {
  const { focusTag } = useEditDialogContext();
  const { tags, setTag } = useEditContext().tags;

  // TODO this code will be replaced when implementing id presets fields
  const nextWikimediaCommonsIndex = getNextWikimediaCommonsIndex(tags);
  const data = getData(nextWikimediaCommonsIndex + 1);

  const [activeMajorKeys, setActiveMajorKeys] = useState(() =>
    data.keys.filter((k) => !!tags[k]),
  );

  const inactiveMajorKeys = data.keys.filter(
    (k) =>
      !activeMajorKeys.includes(k) ||
      k === getWikimediaCommonsKey(nextWikimediaCommonsIndex + 1),
  );

  useEffect(() => {
    // name can be clicked even though it was built from preset name
    if (focusTag === 'name' && !activeMajorKeys.includes('name')) {
      setActiveMajorKeys((arr) => [...arr, 'name']);
    }
  }, [focusTag]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {activeMajorKeys.map((k) => (
        <div key={k}>
          {k === 'opening_hours' ? (
            <OpeningHoursEditor />
          ) : (
            <TextFieldWithCharacterCount
              label={data.names[k]}
              k={k}
              autoFocus={focusTag === k}
              onChange={(e) => {
                setTag(e.target.name, e.target.value);
              }}
              value={tags[k] ?? ''}
            />
          )}
        </div>
      ))}
      {!!inactiveMajorKeys.length && (
        <>
          <Typography variant="body1" component="span" color="textSecondary">
            {t('editdialog.add_major_tag')}:
          </Typography>
          {inactiveMajorKeys.map((k) => (
            <React.Fragment key={k}>
              {' '}
              <Button
                size="small"
                onClick={() => setActiveMajorKeys((arr) => [...arr, k])}
              >
                {data.names[k]}
              </Button>
            </React.Fragment>
          ))}
        </>
      )}
      <br />
      <br />
    </>
  );
};
