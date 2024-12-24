import React from 'react';
import styled from '@emotion/styled';
import {
  getImageDefId,
  ImageType,
} from '../../../../services/images/getImageDefs';
import { PathsSvg } from '../PathsSvg';

import { HEIGHT } from '../helpers';
import { initialSize, UncertainCover, useImgSizeOnload } from './helpers';
import { PanoramaImg } from './PanoramaImg';
import { InfoButton } from './InfoButton';
import { ImageDef, isTag } from '../../../../services/types';
import { isMobileMode } from '../../../helpers';
import { css } from '@emotion/react';

const Img = styled.img<{ $hasPaths: boolean }>`
  margin-left: 50%;
  transform: translateX(-50%);

  ${({ $hasPaths }) => $hasPaths && `opacity: 0.9;`}
`;

const CROP_IMAGE_CSS = css`
  overflow: hidden;
  max-width: calc(410px - 2 * 8px);
  @media ${isMobileMode} {
    max-width: calc(100% - 2 * 8px);
  }

  &:has(+ div) {
    // leave some space if there is another image on the right
    max-width: calc(410px - 2 * 8px - 15px);
    @media ${isMobileMode} {
      max-width: calc(100% - 2 * 8px - 15px);
    }
  }
`;

const ImageWrapper = styled.div<{ $hasPaths: boolean }>`
  display: inline-block;
  position: relative;
  height: 238px;
  vertical-align: top;
  overflow: hidden;

  margin-right: 12px;
  &:first-of-type {
    margin-left: 16px;
  }

  ${({ onClick }) => onClick && `cursor: pointer;`}
  ${({ $hasPaths }) => !$hasPaths && CROP_IMAGE_CSS}
`;

type Props = {
  def: ImageDef;
  image: ImageType;
  onClick: (def: ImageDef) => void;
};

export const Image = ({ def, image, onClick }: Props) => {
  const { imgRef, size, onPhotoLoad } = useImgSizeOnload();

  const hasPaths =
    isTag(def) && !!(def.path?.length || def.memberPaths?.length);

  const isImageLoaded = size !== initialSize;
  const showInfo = image.panoramaUrl || isImageLoaded;
  return (
    <ImageWrapper
      $hasPaths={hasPaths}
      onClick={(e) => {
        onClick(def);
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      {image.panoramaUrl ? (
        <PanoramaImg small={image.imageUrl} large={image.panoramaUrl} />
      ) : (
        <Img
          src={image.imageUrl}
          height={HEIGHT}
          alt={getImageDefId(def)}
          onLoad={onPhotoLoad}
          $hasPaths={hasPaths}
          ref={imgRef}
        />
      )}
      {hasPaths && <PathsSvg def={def} size={size} />}
      {showInfo && <InfoButton image={image} />}
      {image.uncertainImage && !image.panoramaUrl && <UncertainCover />}
    </ImageWrapper>
  );
};
