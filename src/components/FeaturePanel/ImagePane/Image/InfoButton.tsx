import React from 'react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { ImageType } from '../../../../services/images/getImageDefs';
import { t } from '../../../../services/intl';
import { TooltipButton } from '../../../utils/TooltipButton';

const TooltipContent = ({ image }: { image: ImageType }) => (
  <>
    {image.description}
    <br />
    <a href={image.linkUrl} target="_blank">
      {image.link}
    </a>
    {image.uncertainImage && (
      <>
        <br />
        <br />
        {t('featurepanel.uncertain_image', {
          from: image.provider ?? 'Mapillary',
        })}
      </>
    )}
  </>
);

const InfoButtonWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
  svg {
    color: #fff;
    filter: drop-shadow(0 0 2px #000);
    font-size: 15px;
  }
`;

export const InfoButton = ({ image }: { image: ImageType }) => (
  <InfoButtonWrapper>
    <TooltipButton
      tooltip={
        <>
          <TooltipContent image={image} />
          {image.sameUrlResolvedAlsoFrom?.map((item) => (
            <Box key={item.imageUrl} mt={1}>
              <TooltipContent image={item} />
            </Box>
          ))}
        </>
      }
    />
  </InfoButtonWrapper>
);
