import styled from '@emotion/styled';
import React, { useCallback, useState } from 'react';
import { Stack } from '@mui/material';
import { Result } from './Result';
import { RoutingResult } from './routing/types';
import { isTabletResolution, useBoolState, useMobileMode } from '../helpers';
import { DirectionsForm } from './DirectionsForm';
import { result } from 'lodash';
import { useDirectionsContext } from './DirectionsContext';

const Wrapper = styled(Stack, {
  shouldForwardProp: (prop) => prop !== '$isMobileMode',
})<{ $isMobileMode: boolean }>`
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  z-index: 1001; // over the LayerSwitcherButton
  max-height: calc(100vh - 16px);
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.12);

  @media ${isTabletResolution} {
    max-width: 394px;
  }
`;

export const DirectionsBox = () => {
  const isMobileMode = useMobileMode();
  const [revealed, revealForm, hide] = useBoolState(true); // mobile only
  const hideForm = isMobileMode && result && !revealed;

  const { setResult } = useDirectionsContext();

  const setResultAndHide = useCallback(
    (result: RoutingResult) => {
      setResult(result);
      hide();
    },
    [hide, setResult],
  );

  return (
    <Wrapper spacing={1} $isMobileMode={isMobileMode}>
      <DirectionsForm setResult={setResultAndHide} hideForm={hideForm} />
      {result && <Result revealForm={!revealed && revealForm} />}
    </Wrapper>
  );
};
