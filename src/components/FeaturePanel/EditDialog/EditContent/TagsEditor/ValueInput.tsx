import React, { ChangeEvent, FocusEvent, useRef, useState } from 'react';
import { useEditDialogContext } from '../../../helpers/EditDialogContext';
import { useEditContext } from '../../EditContext';
import { IconButton, Stack, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getInputTypeForKey } from '../helpers';

const useHidableDeleteButton = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonShown, setButtonShown] = useState(false);
  const onInputFocus = () => setButtonShown(true);
  const onInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget !== buttonRef.current) {
      setButtonShown(false);
    }
  };
  const onButtonBlur = () => setButtonShown(false);

  return {
    shown: buttonShown,
    onInputFocus,
    onInputBlur,
    onBlur: onButtonBlur,
    ref: buttonRef,
  };
};

type DeleteButtonProps = {
  deleteButton: ReturnType<typeof useHidableDeleteButton>;
  index: number;
};
const DeleteButton = ({ deleteButton, index }: DeleteButtonProps) => {
  const { setTagsEntries } = useEditContext().tags;
  const onClick = () => {
    setTagsEntries((state) => state.toSpliced(index, 1));
  };

  if (!deleteButton.shown) {
    return null;
  }
  return (
    <IconButton
      size="small"
      onClick={onClick}
      onBlur={deleteButton.onBlur}
      ref={deleteButton.ref}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  );
};

type Props = { index: number };
export const ValueInput = ({ index }: Props) => {
  const { focusTag } = useEditDialogContext();
  const { tagsEntries, setTagsEntries } = useEditContext().tags;
  const [currentKey, currentValue] = tagsEntries[index];

  const deleteButton = useHidableDeleteButton();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagsEntries((state) =>
      state.map(([key, value], idx) =>
        idx === index ? [key, e.target.value] : [key, value],
      ),
    );
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <TextField
        type={getInputTypeForKey(currentKey)}
        value={currentValue}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        size="small"
        slotProps={{
          htmlInput: { autoCapitalize: 'none', maxLength: 255 },
        }}
        autoFocus={focusTag === currentKey}
        onFocus={deleteButton.onInputFocus}
        onBlur={deleteButton.onInputBlur}
      />
      <DeleteButton deleteButton={deleteButton} index={index} />
    </Stack>
  );
};
