import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Router from 'next/router';
import { fetchJson } from '../../services/fetch';
import { useMapStateContext } from '../utils/MapStateContext';
import { useFeatureContext } from '../utils/FeatureContext';
import { AutocompleteInput } from './AutocompleteInput';
import { intl, t } from '../../services/intl';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { isDesktop } from '../helpers';

const apiKey = '7dlhLl3hiXQ1gsth0kGu'; // todo merge with consts.ts

const TopPanel = styled.div`
  position: absolute;
  height: 72px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.12);
  background-color: #eb5757;
  padding: 10px;
  box-sizing: border-box;

  z-index: 1200;

  width: 100%;
  @media ${isDesktop} {
    width: 410px;
  }
`;

const StyledPaper = styled(Paper)`
  padding: 2px 4px;
  display: flex;
  align-items: center;

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

// TODO maybe search also in displayed vector map (queryFeatures)
const getApiUrl = (center, inputValue) =>
  `https://api.maptiler.com/geocoding/${inputValue}.json?key=${apiKey}&language=${intl.lang}&promixity=${center}`;

const fetchOptions = throttle(async (inputValue, center, setOptions) => {
  const maptilerResponse = await fetchJson(getApiUrl(center, inputValue));
  const options = maptilerResponse.features;
  setOptions(options || []);
}, 400);

const SearchBox = () => {
  const { featureShown, setFeature } = useFeatureContext();
  const { view } = useMapStateContext();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const autocompleteRef = useRef();

  const [, lat, lon] = view;
  const center = [lon, lat];

  React.useEffect(() => {
    if (inputValue === '') {
      setOptions([]);
      return;
    }
    fetchOptions(inputValue, center, setOptions);
  }, [inputValue]);

  const closePanel = () => {
    setInputValue('');
    setFeature(null); // for nonOsmFeature
    Router.push(`/${window.location.hash}`);
  };

  return (
    <TopPanel>
      <StyledPaper elevation={1} ref={autocompleteRef}>
        <SearchIconButton disabled aria-label={t('searchbox.placeholder')}>
          <SearchIcon />
        </SearchIconButton>

        <AutocompleteInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          options={options}
          autocompleteRef={autocompleteRef}
        />

        {featureShown && <ClosePanelButton onClick={closePanel} />}
      </StyledPaper>
    </TopPanel>
  );
};

export default SearchBox;
