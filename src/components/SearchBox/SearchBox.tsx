import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, IconButton, Paper } from '@mui/material';
import Router from 'next/router';
import { useFeatureContext } from '../utils/FeatureContext';
import { AutocompleteInput } from './AutocompleteInput';
import { t } from '../../services/intl';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { isDesktop, useMobileMode } from '../helpers';
import { SEARCH_BOX_HEIGHT } from './consts';
import { HamburgerMenu } from '../Map/TopMenu/HamburgerMenu';
import { UserMenu } from '../Map/TopMenu/UserMenu';
import { setLastFeature } from '../../services/lastFeatureStorage';

const TopPanel = styled.div`
  position: absolute;
  height: ${SEARCH_BOX_HEIGHT}px;
  padding: 8px;
  box-sizing: border-box;

  top: 0;
  z-index: 1200; // 1100 is PanelWrapper

  width: 100%;
  @media ${isDesktop} {
    width: 410px;
  }
`;

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== '$withShadow',
})<{ $withShadow: boolean }>`
  padding: 2px 4px;
  display: flex;
  align-items: center;
  background-color: ${({ $withShadow, theme }) =>
    $withShadow
      ? theme.palette.background.searchInput
      : theme.palette.background.searchInputPanel};
  -webkit-backdrop-filter: blur(35px);
  backdrop-filter: blur(35px);
  transition: box-shadow 0s !important;
  box-shadow: ${({ $withShadow }) =>
    $withShadow ? '0 0 20px rgba(0, 0, 0, 0.4)' : 'none'} !important;

  .MuiAutocomplete-root {
    flex: 1;
  }
`;

const SearchIconButton = styled(IconButton)`
  svg {
    transform: scaleX(-1);
    filter: FlipH;
    -ms-filter: 'FlipH';
  }
`;

const OverpassCircularProgress = styled(CircularProgress)`
  padding: 10px;
`;

// https://docs.mapbox.com/help/troubleshooting/working-with-large-geojson-data/

const useOnClosePanel = () => {
  const { setFeature } = useFeatureContext();

  return () => {
    setFeature(null);
    Router.push(`/${window.location.hash}`);
    setLastFeature(null);
  };
};

const SearchBox = ({ withShadow = false }) => {
  const isMobileMode = useMobileMode();
  const { featureShown } = useFeatureContext();
  const [overpassLoading, setOverpassLoading] = useState(false);
  const autocompleteRef = useRef();
  const onClosePanel = useOnClosePanel();

  return (
    <TopPanel>
      <StyledPaper $withShadow={withShadow} elevation={1} ref={autocompleteRef}>
        <SearchIconButton disabled aria-label={t('searchbox.placeholder')}>
          <SearchIcon />
        </SearchIconButton>

        <AutocompleteInput
          autocompleteRef={autocompleteRef}
          setOverpassLoading={setOverpassLoading}
        />

        {overpassLoading && <OverpassCircularProgress />}
        {!isMobileMode && featureShown && (
          <ClosePanelButton onClick={onClosePanel} />
        )}
        {isMobileMode && (
          <>
            <UserMenu />
            <HamburgerMenu />
          </>
        )}
      </StyledPaper>
    </TopPanel>
  );
};

export default SearchBox;
