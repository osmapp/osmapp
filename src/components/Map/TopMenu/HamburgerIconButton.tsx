import { IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import styled from 'styled-components';
import { t } from '../../../services/intl';

const StyledIconButton = styled(IconButton)`
  padding: 12px;
  margin-left: -10px;

  svg {
    filter: drop-shadow(0 0 2px #ffffff);
  }
`;

export const HamburgerIconButton = ({ anchorRef, onClick }) => (
  <StyledIconButton
    ref={anchorRef}
    aria-controls="hamburger-menu"
    aria-haspopup="true"
    title={t('map.more_button_title')}
    color="secondary"
    onClick={onClick}
  >
    <ExpandMoreIcon />
  </StyledIconButton>
);
