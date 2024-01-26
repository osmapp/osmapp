import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useClimbingContext } from './contexts/ClimbingContext';
import { PanelScrollbars, PanelWrapper } from '../../utils/PanelHelpers';
import { RoutesLayer } from './Editor/RoutesLayer';
import { RouteList } from './RouteList/RouteList';
import { FullscreenIconContainer, ShowFullscreen } from './ShowFullscreen';
import { ClimbingDialog } from './ClimbingDialog';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getLabel } from '../../../helpers/featureLabel';

const ThumbnailContainer = styled.div<{ height: number }>`
  width: 100%;
  height: ${({ height }) => height}px;
  position: relative;
  :hover ${FullscreenIconContainer} {
    visibility: visible;
    backdrop-filter: blur(3px);
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
`;

const Heading = styled.div`
  margin: 12px 8px 4px;
  font-size: 36px;
  line-height: 0.98;
  color: ${({ theme }) => theme.palette.text.panelHeading};
`;
const Thumbnail = styled.img`
  width: 100%;
  position: absolute;
`;

export const ClimbingPanel = ({ footer }) => {
  const [isFullscreenDialogOpened, setIsFullscreenDialogOpened] =
    useState<boolean>(false);

  const { feature } = useFeatureContext();
  const label = getLabel(feature);

  const {
    setIsEditMode,
    handleImageLoad,
    imageSize,
    photoPath,
    photoRef,
    setPointSelectedIndex,
  } = useClimbingContext();

  useEffect(() => {
    if (!isFullscreenDialogOpened) {
      // @TODO create a new state for closing fullscreen dialog
      setIsEditMode(false);
      setPointSelectedIndex(null);
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
              <ThumbnailContainer height={imageSize.height}>
                <Thumbnail src={photoPath} ref={photoRef} />

                <RoutesLayer onClick={() => null} />
                <ShowFullscreen
                  onClick={() => setIsFullscreenDialogOpened(true)}
                />
              </ThumbnailContainer>
              <Heading>{label}</Heading>

              <RouteList />
            </>
          )}

          {/* TODO unite with parent panel */}
          <div style={{ padding: '20px 15px 0 15px' }}>{footer}</div>
        </PanelScrollbars>
      </PanelWrapper>
    </>
  );
};