import styled from '@emotion/styled';
import React, { useCallback, useState } from 'react';
import { Stack } from '@mui/material';
import { Result } from './Result';
import { RoutingResult } from './routing/types';
import { isTabletResolution, useBoolState, useMobileMode } from '../helpers';
import { DirectionsForm } from './DirectionsForm';

const Wrapper = styled(Stack)<{ $isMobileMode: boolean }>`
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  z-index: 1001; // over the LayerSwitcherButton
  max-height: calc(100vh - 16px);

  @media ${isTabletResolution} {
    max-width: 340px;
  }
`;

export const DirectionsBox = () => {
  const isMobileMode = useMobileMode();
  const [result, setResult] = useState<RoutingResult>(null);
  const [revealed, revealForm, hide] = useBoolState(false); // mobile only
  const hideForm = isMobileMode && result && !revealed;

  const setResultAndHide = useCallback(
    (result: RoutingResult) => {
      setResult(result);
      hide();
    },
    [hide],
  );

  return (
    <Wrapper spacing={1} $isMobileMode={isMobileMode}>
      <DirectionsForm setResult={setResultAndHide} hideForm={hideForm} />
      {result && (
        <Result result={result} revealForm={!revealed && revealForm} />
      )}
    </Wrapper>
  );
};
