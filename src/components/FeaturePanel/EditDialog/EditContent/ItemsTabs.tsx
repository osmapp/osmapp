import styled from '@emotion/styled';
import {
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEditContext } from '../EditContext';
import React from 'react';
import { getOsmTypeFromShortId, NwrIcon } from '../../NwrIcon';
import { EditDataItem } from '../useEditItems';

const StyledTypography = styled(Typography)<{ $deleted: boolean }>`
  ${({ $deleted }) => $deleted && 'text-decoration: line-through;'}
`;

const StyledTabs = styled(Tabs)`
  border-color: ${({ theme }) => theme.palette.divider};
  && .MuiTab-root {
    text-align: left;
  }

  ${({ theme }) => theme.breakpoints.up('sm')} {
    border-right: 1px solid ${({ theme }) => theme.palette.divider};
    resize: horizontal;
    min-width: 120px;
    max-width: 50%;

    .MuiTab-root {
      align-items: baseline;
      border-bottom: solid 1px ${({ theme }) => theme.palette.divider};
    }
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};

    .MuiTab-root {
      align-items: center;
    }
  }
`;

type TableLabelProps = {
  item: EditDataItem;
};
const TabLabel = ({
  item: { shortId, tags, presetLabel, toBeDeleted },
}: TableLabelProps) => (
  <Stack direction="column" alignItems="flex-start" width="100%">
    <Stack
      direction="row"
      gap={1}
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <StyledTypography
        variant="button"
        whiteSpace="nowrap"
        $deleted={toBeDeleted}
      >
        {tags.name ?? shortId}
      </StyledTypography>
      <NwrIcon osmType={getOsmTypeFromShortId(shortId)} />
    </Stack>
    <Typography variant="caption" textTransform="lowercase" whiteSpace="nowrap">
      {presetLabel}
    </Typography>
  </Stack>
);

export const ItemsTabs = () => {
  const { items, current, setCurrent } = useEditContext();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      {items.length > 1 && (
        <StyledTabs
          orientation={isSmallScreen ? 'horizontal' : 'vertical'}
          variant={isSmallScreen ? 'scrollable' : 'standard'}
          value={current}
          onChange={(_event: React.SyntheticEvent, newShortId: string) => {
            setCurrent(newShortId);
          }}
        >
          {items.map((item, idx) => (
            <Tab
              key={idx}
              label={<TabLabel item={item} />}
              value={item.shortId}
              sx={{
                maxWidth: '100%',
                ...(isSmallScreen
                  ? {}
                  : { borderBottom: `solid 1px ${theme.palette.divider}` }),
              }}
            />
          ))}
        </StyledTabs>
      )}
    </>
  );
};
