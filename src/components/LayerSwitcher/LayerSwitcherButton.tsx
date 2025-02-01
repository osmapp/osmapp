import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import LayersIcon from './LayersIcon';
import { t } from '../../services/intl';
import { useMobileMode } from '../helpers';
import { convertHexToRgba } from '../utils/colorUtils';

const StyledLayerSwitcher = styled('button', {
  shouldForwardProp: (prop) => prop !== '$isMobileMode',
})<{ $isMobileMode: boolean }>`
  margin: 0;
  padding: 0;
  ${({ $isMobileMode }) =>
    $isMobileMode
      ? css`
          width: 44px;
          height: 44px;
          border-radius: 50%;
        `
      : css`
          width: 52px;
          height: 69px;
          border-radius: 5px;
        `}

  border: 0;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.paper, 0.7)};
  backdrop-filter: blur(15px);
  font-size: 12px;
  color: ${({ theme }) => theme.palette.text.primary};
  outline: 0;
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: ${({ theme }) =>
      convertHexToRgba(theme.palette.background.paper, 0.75)};
  }

  svg {
    margin: 4px auto 4px auto;
  }
`;

export const LayerSwitcherButton = ({
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const isMobileMode = useMobileMode();
  return (
    <StyledLayerSwitcher onClick={onClick} $isMobileMode={isMobileMode}>
      <LayersIcon />
      {!isMobileMode && t('layerswitcher.button')}
    </StyledLayerSwitcher>
  );
};
