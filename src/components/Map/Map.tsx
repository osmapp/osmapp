import React, { useEffect } from 'react';

import styled from 'styled-components';
import dynamic from 'next/dynamic';
import BugReport from '@mui/icons-material/BugReport';
import { Button, CircularProgress } from '@mui/material';
import { isDesktop, useBoolState } from '../helpers';
import { MapFooter } from './MapFooter/MapFooter';
import { SHOW_PROTOTYPE_UI } from '../../config';
import { LayerSwitcherButton } from '../LayerSwitcher/LayerSwitcherButton';
import { MaptilerLogo } from './MapFooter/MaptilerLogo';
import { TopMenu } from './TopMenu/TopMenu';
import { ClimbingLegend } from './MapFooter/ClimbingLegend';
import { convertHexToRgba } from '../utils/colorUtils';
import { usePersistedState } from '../utils/usePersistedState';

const BrowserMap = dynamic(() => import('./BrowserMap'), {
  ssr: false,
  loading: () => <div />,
});

const LayerSwitcherDynamic = dynamic(
  () => import('../LayerSwitcher/LayerSwitcher'),
  {
    ssr: false,
    loading: () => <LayerSwitcherButton />,
  },
);

const Spinner = styled(CircularProgress)`
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -20px 0 0 -20px;
`;

const TopRight = styled.div`
  position: absolute;
  z-index: 1000;
  padding: 10px;
  right: 0;
  top: 72px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media ${isDesktop} {
    top: 0;
  }
`;

const BottomRight = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1000;
  text-align: right;
  pointer-events: none;
  z-index: 999;
`;

const FooterContainer = styled.div`
  margin: 0 4px 4px 4px;
  pointer-events: all;
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
  color: ${({ theme }) => theme.palette.text.primary};
  background-color: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.paper, 0.5)};
  backdrop-filter: blur(10px);
`;

const BugReportButton = () => (
  <Button size="small">
    <BugReport width="10" height="10" />
    Nahlásit chybu v mapě
  </Button>
);

const NoscriptMessage = () => (
  <noscript>
    <span style={{ position: 'absolute', left: '50%', top: '50%' }}>
      This map needs Javascript.
    </span>
  </noscript>
);

const Map = () => {
  const [mapLoaded, setLoaded, setNotLoaded] = useBoolState(true);
  useEffect(setNotLoaded, []);
  const [isLegendVisible, setIsLegendVisible] = usePersistedState<boolean>(
    'isLegendVisible',
    true,
  );
  return (
    <>
      <BrowserMap onMapLoaded={setLoaded} />
      {!mapLoaded && <Spinner color="secondary" />}
      <NoscriptMessage />
      <TopRight>
        <TopMenu />
        <LayerSwitcherDynamic />
      </TopRight>
      <BottomRight>
        {SHOW_PROTOTYPE_UI && <BugReportButton />}
        <MaptilerLogo />
        <FooterContainer>
          <ClimbingLegend
            isLegendVisible={isLegendVisible}
            setIsLegendVisible={setIsLegendVisible}
          />
          <MapFooter
            isLegendVisible={isLegendVisible}
            setIsLegendVisible={setIsLegendVisible}
          />
        </FooterContainer>
      </BottomRight>
    </>
  );
};

export default Map;
