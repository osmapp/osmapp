import React, { useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, IconButton, Paper } from '@mui/material';
import Router from 'next/router';
import { useFeatureContext } from '../utils/FeatureContext';
import { AutocompleteInput } from './AutocompleteInput';
import { t } from '../../services/intl';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { isDesktop, useMobileMode } from '../helpers';
import { SEARCH_BOX_HEIGHT } from './consts';
import { useInputValueState } from './options/geocoder';
import { useOptions } from './useOptions';
import { HamburgerMenu } from '../Map/TopMenu/HamburgerMenu';
import { LoginMenu } from '../Map/TopMenu/LoginMenu';

const TopPanel = styled.div<{ $isMobileMode: boolean }>`
  position: absolute;
  height: ${SEARCH_BOX_HEIGHT}px;
  ${({ $isMobileMode }) =>
    !$isMobileMode &&
    css`
      box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.12);
      background-color: ${({ theme }) => theme.palette.background.searchBox};
    `}

  padding: 10px;
  box-sizing: border-box;

  z-index: 1;

  width: 100%;
  @media ${isDesktop} {
    width: 410px;
  }
`;

const StyledPaper = styled(Paper)`
  padding: 2px 4px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.background.searchInput};
  -webkit-backdrop-filter: blur(35px);
  backdrop-filter: blur(35px);

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
  const { feature, setFeature, setPreview } = useFeatureContext();
  const mobileMode = useMobileMode();

  return () => {
    if (mobileMode) {
      setPreview(feature);
    }
    setFeature(null);
    Router.push(`/${window.location.hash}`);
  };
};

const SearchBox = () => {
  const isMobileMode = useMobileMode();
  const { featureShown } = useFeatureContext();
  const { inputValue, setInputValue } = useInputValueState();
  const [options, setOptions] = useState([]);
  const [overpassLoading, setOverpassLoading] = useState(false);
  const autocompleteRef = useRef();
  const onClosePanel = useOnClosePanel();

  useOptions(inputValue, setOptions);

  return (
    <TopPanel $isMobileMode={isMobileMode}>
      <StyledPaper elevation={1} ref={autocompleteRef}>
        <SearchIconButton disabled aria-label={t('searchbox.placeholder')}>
          <SearchIcon />
        </SearchIconButton>

        <AutocompleteInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          options={options}
          autocompleteRef={autocompleteRef}
          setOverpassLoading={setOverpassLoading}
        />

        {featureShown && !isMobileMode && (
          <ClosePanelButton onClick={onClosePanel} />
        )}
        {isMobileMode && (
          <>
            <LoginMenu />
            <HamburgerMenu />
          </>
        )}
        {overpassLoading && <OverpassCircularProgress />}
      </StyledPaper>
    </TopPanel>
  );
};

export default SearchBox;
