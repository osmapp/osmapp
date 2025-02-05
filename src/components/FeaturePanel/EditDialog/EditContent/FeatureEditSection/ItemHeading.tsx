import { useCurrentItem } from './CurrentContext';
import { Stack, Typography } from '@mui/material';
import { getOsmTypeFromShortId, NwrIcon } from '../../../NwrIcon';
import React from 'react';

export const ItemHeading = () => {
  const { shortId, tags, presetLabel } = useCurrentItem();

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Typography variant="h6">{tags.name || presetLabel || ' '}</Typography>
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="caption" color="secondary">
          {shortId}
        </Typography>
        <NwrIcon osmType={getOsmTypeFromShortId(shortId)} />
      </Stack>
    </Stack>
  );
};
