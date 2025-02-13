import { useCurrentItem } from './CurrentContext';
import { Stack, Typography } from '@mui/material';
import { getOsmTypeFromShortId, NwrIcon } from '../../../NwrIcon';
import React from 'react';
import styled from '@emotion/styled';

const StyledTypography = styled(Typography)<{ $deleted: boolean }>`
  ${({ $deleted }) => $deleted && 'text-decoration: line-through;'}
`;

export const ItemHeading = () => {
  const { shortId, tags, presetLabel, toBeDeleted } = useCurrentItem();

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <StyledTypography variant="h6" $deleted={toBeDeleted}>
        {tags.name || presetLabel || ' '}
      </StyledTypography>
      <Stack direction="row" alignItems="center" gap={0.5}>
        <Typography variant="caption" color="secondary">
          {shortId}
        </Typography>
        <NwrIcon osmType={getOsmTypeFromShortId(shortId)} />
      </Stack>
    </Stack>
  );
};
