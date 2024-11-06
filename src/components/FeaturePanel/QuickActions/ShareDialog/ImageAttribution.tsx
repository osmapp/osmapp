import { useState } from 'react';
import { useFeatureContext } from '../../../utils/FeatureContext';
import { useGetItems } from './useGetItems';
import { IconButton, Stack } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from '@emotion/styled';
import { useUserThemeContext } from '../../../../helpers/theme';
import { t } from '../../../../services/intl';

const Wrapper = styled.div<{ $currentTheme: 'dark' | 'light' }>`
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: ${({ theme, $currentTheme }) =>
    theme.palette.secondary[$currentTheme === 'dark' ? 'light' : 'dark']};
  svg {
    font-size: 0.8rem;
    color: ${({ theme, $currentTheme }) =>
      theme.palette.secondary[$currentTheme === 'dark' ? 'light' : 'dark']};
  }
`;

const Heading = styled.h4`
  font-weight: normal;
`;

export const ImageAttribution = () => {
  const { currentTheme } = useUserThemeContext();
  const { imageAttributions } = useGetItems();
  const [expanded, setExpanded] = useState(false);

  return (
    <Wrapper $currentTheme={currentTheme}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Heading>{t('sharedialog.image_attribution')}</Heading>
        <IconButton onClick={() => setExpanded((x) => !x)} size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Stack>
      {expanded && (
        <ul>
          {imageAttributions.map(({ label, href }) => (
            <li key={label}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  );
};
