import React from 'react';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import styled from '@emotion/styled';
import { ImageType } from '../../../../services/images/getImageDefs';
import { t } from '../../../../services/intl';
import { TooltipButton } from '../../../utils/TooltipButton';

type TooltipProps = {
  images: ImageType[];
};

const TooltipContent = ({ images }: TooltipProps) => {
  const descs: string[] = uniq(images.map(({ description }) => description));
  const links: [string, string][] = uniqBy(
    images.map(({ linkUrl, link }) => [linkUrl, link]),
    ([url, link]) => `${url}-${link}`,
  );
  const isUncertain = images.some(({ uncertainImage }) => uncertainImage);
  return (
    <>
      {descs.map((desc) => (
        <>
          {desc}
          <br />
        </>
      ))}
      {links.map(([linkUrl, link]) => (
        <>
          <a href={linkUrl} target="_blank" key={linkUrl}>
            {link}
          </a>
          <br />
        </>
      ))}
      {isUncertain && (
        <>
          <br />
          <br />
          {t('featurepanel.uncertain_image')}
        </>
      )}
    </>
  );
};

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

export const InfoButton = ({ images }: TooltipProps) => (
  <InfoButtonWrapper>
    <TooltipButton tooltip={<TooltipContent images={images} />} />
  </InfoButtonWrapper>
);
