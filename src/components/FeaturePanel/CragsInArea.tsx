import styled from '@emotion/styled';
import { Box, Chip } from '@mui/material';
import React from 'react';
import Router from 'next/router';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useFeatureContext } from '../utils/FeatureContext';
import { getOsmappLink, getUrlOsmId } from '../../services/helpers';
import { Feature, isInstant } from '../../services/types';
import { useMobileMode } from '../helpers';
import { getLabel } from '../../helpers/featureLabel';

import { Slider, Wrapper } from './FeatureImages/FeatureImages';
import { Image } from './FeatureImages/Image/Image';
import { getInstantImage } from '../../services/images/getImageDefs';
import { intl, t } from '../../services/intl';
import Link from 'next/link';
import { naturalSort } from './Climbing/utils/array';
import { PanelLabel } from './Climbing/PanelLabel';
import { PROJECT_ID } from '../../services/project';
import { handleClimbingDialogOnClick } from './FeatureImages/Image/helpers';

const isOpenClimbing = PROJECT_ID === 'openclimbing';


const ArrowIcon = styled(ArrowForwardIosIcon)`
  opacity: 0.2;
  margin-left: 12px;
`;

const Container = styled.div`
  overflow: auto;
  flex-direction: column;
  display: flex;
  gap: 8px;
  justify-content: space-between;
  cursor: pointer;
  //border-radius: 8px;
  padding: 0 0 20px 0;
  //background-color: ${({ theme }) => theme.palette.background.elevation};
  &:hover {
    ${ArrowIcon} {
      opacity: 1;
    }
  }
`;

const CragList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 12px;
`;

const Name = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CragName = styled.h2`
  font-weight: 900;
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  ${isOpenClimbing && `font-family: 'Piazzolla', sans-serif;`}
  color: ${({ theme }) => theme.palette.primary.main};
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  text-decoration: none !important;
  &:hover ${Name} {
    text-decoration: underline;
  }
`;

const Header = ({
  label,
  routesCount,
}: {
  label: string;
  routesCount: number;
}) => (
  <Box ml={2} mr={2}>
    <CragName>
      <Name>{label}</Name>
      {routesCount && (
        <Chip
          size="small"
          variant="outlined"
          label={
            <>
              <strong>{routesCount}</strong> {t('featurepanel.routes')}
            </>
          }
          sx={{ position: 'relative', top: 2, fontWeight: 'normal' }}
        />
      )}
    </CragName>{' '}
  </Box>
);

const Gallery = ({ images, feature }) => {
  return (
    <Wrapper>
      <Slider>
        {naturalSort(images, (item) => item.def.k).map((item) => (
          <Image
            key={item.image.imageUrl}
            def={item.def}
            image={item.image}
            onClick={handleClimbingDialogOnClick(feature, item.def)}
          />
        ))}
      </Slider>
    </Wrapper>
  );
};

const CragItem = ({ feature }: { feature: Feature }) => {
  const mobileMode = useMobileMode();
  const { setPreview } = useFeatureContext();
  const handleHover = () => feature.center && setPreview(feature);

  const images =
    feature?.imageDefs?.filter(isInstant)?.map((def) => ({
      def,
      image: getInstantImage(def),
    })) ?? [];

  const getOnClickWithHash = (e) => {
    e.preventDefault();
    Router.push(`/${getUrlOsmId(feature.osmMeta)}${window.location.hash}`);
  };

  return (
    <StyledLink
      href={`/${getUrlOsmId(feature.osmMeta)}`}
      locale={intl.lang}
      onClick={getOnClickWithHash}
      onMouseEnter={mobileMode ? undefined : handleHover}
      onMouseLeave={() => setPreview(null)}
    >
      <Container>
        <Header
          label={getLabel(feature)}
          routesCount={feature.members?.length}
        />
        {images.length ? <Gallery feature={feature} images={images} /> : null}
      </Container>
    </StyledLink>
  );
};

export const CragsInArea = () => {
  const { feature } = useFeatureContext();

  if (!feature.memberFeatures?.length || feature.tags.climbing !== 'area') {
    return null;
  }

  return (
    <>
      <PanelLabel>
        {t('featurepanel.climbing_sectors')}{' '}
        {feature.tags.name
          ? `${t('featurepanel.climbing_sectors_in')} ${feature.tags.name}`
          : ''}
      </PanelLabel>
      <Box mt={2} mb={2}>
        <CragList>
          {feature.memberFeatures.map((item) => (
            <CragItem key={getOsmappLink(item)} feature={item} />
          ))}
        </CragList>
      </Box>
    </>
  );
};
