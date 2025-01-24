import styled from '@emotion/styled';
import React, { useEffect, useRef } from 'react';
import Router from 'next/router';
import { Size } from '../types';
import { HEIGHT } from '../helpers';
import { useFeatureContext } from '../../../utils/FeatureContext';
import { getOsmappLink } from '../../../../services/helpers';
import { removeFilePrefix } from '../../Climbing/utils/photo';
import { ImageDef, isTag } from '../../../../services/types';

export const initialSize: Size = { width: 100, height: HEIGHT }; // until image size is known, the paths are rendered using this (eg. ssr)

export const useImgSizeOnload = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [size, setSize] = React.useState<Size>(initialSize);
  useEffect(() => {
    if (imgRef.current?.complete) {
      setSize({ width: imgRef.current.width, height: imgRef.current.height }); // SSR case
    }
  }, []);

  const onPhotoLoad = (e) => {
    setSize({ width: e.target.width, height: e.target.height }); // browser case
  };

  return { imgRef, size, onPhotoLoad };
};

export const UncertainCover = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  backdrop-filter: contrast(0.6) brightness(1.2);
  -webkit-backdrop-filter: contrast(0.6) brightness(1.2);
  box-shadow: inset 0 0 100px rgba(255, 255, 255, 0.3);
`;

export const handleClimbingDialogOnClick = (feature, def: ImageDef) => {
  if (isTag(def) && feature.tags.climbing === 'crag') {
    return () => {
      const featureLink = getOsmappLink(feature);
      const photoLink = removeFilePrefix(def.v);
      console.log('___', `${featureLink}/climbing/photo/${photoLink}`);
      Router.push(`${featureLink}/climbing/photo/${photoLink}`);
    };
  }

  return undefined;
};
