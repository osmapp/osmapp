import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { t } from '../../services/intl';
import { fetchJson } from '../../services/fetch';
import { useFeatureContext } from '../utils/FeatureContext';
import { getUrlOsmId } from '../../services/helpers';

const Spacer = styled.div`
  padding-bottom: 10px;
`;

const getData = async (center, osmId) => {
  if (center === undefined || !center.length) {
    return null;
  }
  const body = await fetchJson(
    `https://discover.openplaceguide.org/v2/discover?lat=${center[1]}&lon=${center[0]}&osmId=${osmId}`,
  );
  return body;
};

export const FeatureOpenPlaceGuideLink = () => {
  const supportedCountries = ['et']; // refer to the list of countries here: https://github.com/OpenPlaceGuide/discover-cf-worker/blob/main/index.js#L43

  const { feature } = useFeatureContext();
  const osmId = getUrlOsmId(feature.osmMeta);

  if (!supportedCountries.includes(feature.countryCode)) {
    return null;
  }

  const [instances, setInstances] = useState([]);

  useEffect(() => {
    getData(feature.center, osmId).then(setInstances);
  }, [osmId]);

  if (instances.length === 0) {
    return null;
  }

  return (
    <>
      {instances.map((instance) => (
        <>
          <a href={instance.url}>
            {t('featurepanel.more_in_openplaceguide', {
              instanceName: instance.name,
            })}
          </a>
          <Spacer />
        </>
      ))}
    </>
  );
};
