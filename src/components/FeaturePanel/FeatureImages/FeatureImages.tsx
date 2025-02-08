import React from 'react';
import styled from '@emotion/styled';
import { Scrollbars } from 'react-custom-scrollbars';
import { Image } from './Image/Image';
import { useLoadImages } from './useLoadImages';
import { NoImage } from './NoImage';
import { HEIGHT, ImageSkeleton } from './helpers';
import { naturalSort } from '../Climbing/utils/array';
import { handleClimbingDialogOnClick } from './Image/helpers';
import { useFeatureContext } from '../../utils/FeatureContext';
import { PROJECT_ID } from '../../../services/project';

const isOpenClimbing = PROJECT_ID === 'openclimbing';

export const Wrapper = styled.div`
  width: 100%;
  height: calc(${HEIGHT}px + 10px); // 10px for scrollbar
  min-height: calc(${HEIGHT}px + 10px); // otherwise it shrinks b/c of flex
`;

const StyledScrollbars = styled(Scrollbars)`
  width: 100%;
  height: 100%;
  white-space: nowrap;
  ${!isOpenClimbing && `text-align: center;`} // one image centering

  overflow-y: hidden;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
`;
export const Slider = ({ children }) => (
  <StyledScrollbars universal autoHide>
    {children}
  </StyledScrollbars>
);

export const FeatureImages = () => {
  const { loading, images } = useLoadImages();
  const { feature } = useFeatureContext();
  if (images.length === 0) {
    return <Wrapper>{loading ? <ImageSkeleton /> : <NoImage />}</Wrapper>;
  }

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
