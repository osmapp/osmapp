import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
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
import { handleClimbingDialogOnClick } from './FeatureImages/Image/helpers';

const ArrowIcon = styled(ArrowForwardIosIcon)`
  opacity: 0.2;
  margin-left: 12px;
`;

const HeadingRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 12px;
`;

const Container = styled.div`
  overflow: auto;
  flex-direction: column;
  display: flex;
  gap: 8px;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 8px;
  padding: 12px 0;
  background-color: ${({ theme }) => theme.palette.background.elevation};
  &:hover {
    ${ArrowIcon} {
      opacity: 1;
    }
  }
`;

const CragList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`;

const StyledLink = styled(Link)`
  text-decoration: none !important;
`;

const Content = styled.div`
  flex: 1;
`;

const CragName = styled.div`
  padding: 0;
  font-weight: 900;
  font-size: 20px;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const Attributes = styled.div`
  display: flex;
  gap: 8px;
`;

const NumberOfRoutes = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.palette.secondary.main};
`;

const Header = ({
  imagesCount,
  label,
  routesCount,
}: {
  label: string;
  routesCount: number;
  imagesCount: number;
}) => (
  <HeadingRow>
    <Content>
      <CragName>{label}</CragName>{' '}
      <Attributes>
        {routesCount > 0 && (
          <NumberOfRoutes>{routesCount} routes </NumberOfRoutes>
        )}
        {imagesCount > 0 && (
          <NumberOfRoutes>{imagesCount} photos</NumberOfRoutes>
        )}
      </Attributes>
    </Content>
    <ArrowIcon color="primary" />
  </HeadingRow>
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
          imagesCount={images.length}
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
    <Box mt={2} mb={2}>
      <Typography variant="subtitle2" color="secondary">
        {t('featurepanel.climbing_sectors')}{' '}
        {feature.tags.name
          ? `${t('featurepanel.climbing_sectors_in')} ${feature.tags.name}`
          : ''}
      </Typography>
      <CragList>
        {feature.memberFeatures.map((item) => (
          <CragItem key={getOsmappLink(item)} feature={item} />
        ))}
      </CragList>
    </Box>
  );
};
