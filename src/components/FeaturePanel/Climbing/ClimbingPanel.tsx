import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useClimbingContext } from './contexts/ClimbingContext';
import { PanelScrollbars, PanelWrapper } from '../../utils/PanelHelpers';
import { RoutesLayer } from './Editor/RoutesLayer';
import { RouteList } from './RouteList/RouteList';
import { Size } from './types';
import { FullscreenIconContainer, ShowFullscreen } from './ShowFullscreen';
import { ClimbingDialog } from './ClimbingDialog';

const ThumbnailContainer = styled.div<{ imageSize: Size }>`
  width: 100%;
  height: ${({ imageSize }) => imageSize.height}px;
  position: relative;
  :hover ${FullscreenIconContainer} {
    visibility: visible;
    backdrop-filter: blur(3px);
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  position: absolute;
`;

export const ClimbingPanel = () => {
  const [isFullscreenDialogOpened, setIsFullscreenDialogOpened] =
    useState<boolean>(false);

  const { setIsEditMode, handleImageLoad, imageSize, photoPath, photoRef } =
    useClimbingContext();

  useEffect(() => {
    if (!isFullscreenDialogOpened) {
      setIsEditMode(false);
    }
  }, [isFullscreenDialogOpened]);

  useEffect(() => {
    handleImageLoad();
  }, [isFullscreenDialogOpened]);

  return (
    <>
      <PanelWrapper>
        <PanelScrollbars>
          {/* <ImageSection /> */}
          {/* <PanelContent>
          <FeatureHeading
            deleted={deleted}
            title={label}
            editEnabled={editEnabled && !point}
            onEdit={setDialogOpenedWith}
          />
          </PanelContent> */}
          <ClimbingDialog
            isFullscreenDialogOpened={isFullscreenDialogOpened}
            setIsFullscreenDialogOpened={setIsFullscreenDialogOpened}
          />

          {!isFullscreenDialogOpened && (
            <>
              <ThumbnailContainer imageSize={imageSize}>
                <Thumbnail src={photoPath} ref={photoRef} />
                <RoutesLayer onClick={() => null} />
                <ShowFullscreen
                  onClick={() => setIsFullscreenDialogOpened(true)}
                />
              </ThumbnailContainer>
              <RouteList />
            </>
          )}
        </PanelScrollbars>
      </PanelWrapper>
    </>
  );
};
