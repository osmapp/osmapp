import styled from '@emotion/styled';
import { Box } from '@mui/material';
import React from 'react';
import Router from 'next/router';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useFeatureContext } from '../utils/FeatureContext';
import { getOsmappLink, getUrlOsmId } from '../../services/helpers';
import { Feature, isInstant, OsmId } from '../../services/types';
import { useMobileMode } from '../helpers';
import { getLabel } from '../../helpers/featureLabel';

import { FeatureImagesUi } from './ImagePane/FeatureImages';
import { getInstantImage } from '../../services/images/getImageDefs';

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
`;
const Link = styled.a`
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

const getOnClickWithHash = (apiId: OsmId) => (e: React.MouseEvent) => {
  e.preventDefault();
  Router.push(`/${getUrlOsmId(apiId)}${window.location.hash}`);
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

  return (
    <Container>
      <Link
        href={`/${getUrlOsmId(feature.osmMeta)}`}
        onClick={getOnClickWithHash(feature.osmMeta)}
        onMouseEnter={mobileMode ? undefined : handleHover}
        onMouseLeave={() => setPreview(null)}
      >
        <Header
          label={getLabel(feature)}
          routesCount={feature.members?.length}
          imagesCount={images.length}
        />
      </Link>
      {!!images.length && (
        <FeatureImagesUi
          groups={images.map(({ def, image }) => ({
            def,
            images: [image],
          }))}
        />
      )}
    </Container>
  );
};

export const CragsInArea = () => {
  const { feature } = useFeatureContext();

  if (!feature.memberFeatures?.length) {
    return null;
  }
  if (feature.tags.climbing !== 'area') {
    return null;
  }

  return (
    <Box mb={2}>
      <CragList>
        {feature.memberFeatures.map((item) => (
          <CragItem key={getOsmappLink(item)} feature={item} />
        ))}
      </CragList>
    </Box>
  );
};
