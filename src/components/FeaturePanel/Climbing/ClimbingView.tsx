import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import SplitPane from 'react-split-pane';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
  CircularProgress,
  Fab,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { TransformComponent } from 'react-zoom-pan-pinch';
import { useClimbingContext } from './contexts/ClimbingContext';
import { RoutesEditor } from './Editor/RoutesEditor';
import { useFeatureContext } from '../../utils/FeatureContext';
import {
  getResolution,
  getWikimediaCommonsKeys,
  getWikimediaCommonsPhotoKeys,
  getWikimediaCommonsPhotoTags,
  getWikimediaCommonsPhotoTagsObject,
  getWikimediaCommonsPhotoValues,
  removeFilePrefix,
} from './utils/photo';
import { TransformWrapper } from './TransformWrapper';
import { convertHexToRgba } from '../../utils/colorUtils';
import { getCommonsImageUrl } from '../../../services/images/getCommonsImageUrl';
import { useUserSettingsContext } from '../../utils/UserSettingsContext';
import { CLIMBING_ROUTE_ROW_HEIGHT, SPLIT_PANE_DEFAULT_SIZE } from './config';
import { ClimbingViewContent } from './ClimbingViewContent';
import { getOsmappLink } from '../../../services/helpers';
import { useRouter } from 'next/router';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import MapIcon from '@mui/icons-material/Map';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useGetCragViewLayout } from './utils/useCragViewLayout';
import { RouteFloatingMenu } from './Editor/RouteFloatingMenu';

export const DEFAULT_CRAG_VIEW_LAYOUT = 'horizontal';

const BottomContainer = styled.div`
  overflow: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const FabContainer = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  z-index: 1000;
`;
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  .Resizer {
    &.horizontal {
      cursor: row-resize;
      height: 15px;
      margin: -7px 0;
      &::before {
        width: 40px;
        height: 12px;
        content: '...';
        justify-content: center;
        align-items: unset;
      }
      &::after {
        border-top: solid 1px #222;
        width: 100%;
        height: 1px;
        margin-top: 1px;
      }
    }
    &.vertical {
      width: 15px;
      cursor: col-resize;
      margin: 0 -7px;
      &::before {
        width: 12px;
        height: 40px;
        content: '⋮';
      }
      &::after {
        border-left: solid 1px #222;
        height: 100%;
        width: 1px;
      }
    }

    z-index: 100000;
    display: flex;
    justify-content: center;
    align-items: center;
    &::before {
      position: absolute;
      display: flex;
      align-items: center;
      border-radius: 6px;
      background: ${({ theme }) => theme.palette.background.paper};
      margin-top: 1px;
      z-index: 1;
      transition: all 0.1s ease;
      border: solid 1px ${({ theme }) => theme.palette.divider};
      text-align: center;
      line-height: 0px;
      font-size: 20px;
      color: ${({ theme }) => theme.palette.primary.main};
      letter-spacing: 1px;
    }
    &::after {
      position: absolute;
      content: '';
      transition: all 0.1s ease;
    }

    &:hover {
      &::before {
        background-color: ${({ theme }) => theme.palette.primary.main};
        border: solid 1px ${({ theme }) => theme.palette.primary.main};
        color: ${({ theme }) => theme.palette.primary.contrastText};
      }
      &::after {
        border-color: ${({ theme }) => theme.palette.primary.main};
        border-width: 1px;
        transition-delay: 500ms;
      }
    }
  }
  .Pane.horizontal.Pane2 {
    overflow: hidden;
  }
`;
const BottomPanel = styled.div`
  height: 100%;
  overflow: auto;
`;

const MiniLoadingContainer = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  z-index: 1;
  background: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.default, 0.3)};
  -webkit-backdrop-filter: blur(22px);
  backdrop-filter: blur(22px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FullLoadingContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  background: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.default, 0.7)};
  -webkit-backdrop-filter: blur(40px);
  backdrop-filter: blur(40px);
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const ArrowExpanderContainer = styled.div<{
  $cragViewLayout: 'horizontal' | 'vertical';
}>`
  position: absolute;
  z-index: 1000000;

  ${({ $cragViewLayout }) =>
    $cragViewLayout === 'horizontal'
      ? `
    top: -6px;
    width: 100%;`
      : `
      left: -6px;
      height: 100%;
      top: 50%;
      `}
`;

const ArrowExpanderButton = styled.div<{ $arrowOnTop?: boolean }>`
  background: ${({ theme }) => theme.palette.background.default};
  width: 30px;
  height: 30px;
  margin: auto;
  border-radius: 50%;
  ${({ $arrowOnTop }) =>
    $arrowOnTop
      ? undefined
      : `
  bottom: 0;
  border-radius: 50%;
  `};
  justify-content: center;
  display: flex;
`;

const BlurContainer = styled.div`
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  background-color: rgba(0, 0, 0, 0.6);
  height: 100%;
`;

const BackgroundContainer = styled.div<{
  $imageHeight: number;
  $imageUrl: string;
}>`
  transition: 0.3s all;
  background: #111 ${({ $imageUrl }) => `url(${$imageUrl}) no-repeat`};
  background-size: cover;
  background-position: center;
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
`;

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

const FabMapSwitcher = ({ isMapVisible, setIsMapVisible }) => (
  <FabContainer>
    <Tooltip
      title={`Show ${isMapVisible ? 'route list' : 'map'}`}
      enterDelay={1500}
      arrow
    >
      <Fab
        size="small"
        color="secondary"
        aria-label="add"
        onClick={() => setIsMapVisible(!isMapVisible)}
      >
        {isMapVisible ? <FormatListNumberedIcon /> : <MapIcon />}
      </Fab>
    </Tooltip>
  </FabContainer>
);

export const ClimbingView = ({ photo }: { photo?: string }) => {
  const {
    imageSize,
    routeSelectedIndex,
    getMachine,
    isEditMode,
    viewportSize,
    editorPosition,
    photoPath,
    loadPhotoRelatedData,
    areRoutesLoading,
    preparePhotos,
    photoZoom,
    loadedPhotos,
    routeListTopOffsets,
    setRouteSelectedIndex,
    routes,
    setIsEditMode,
  } = useClimbingContext();
  const { feature } = useFeatureContext();

  const [photoResolution, setPhotoResolution] = useState(200);
  const [isSplitViewDragging, setIsSplitViewDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(null);
  const machine = getMachine();
  const cragViewLayout = useGetCragViewLayout();
  const { userSettings, setUserSetting } = useUserSettingsContext();
  const splitPaneSize = userSettings['climbing.splitPaneSize'];

  useEffect(() => {
    if (isEditMode && machine.currentStateName === 'routeSelected') {
      machine.execute('editRoute', { routeNumber: routeSelectedIndex }); // možná tímhle nahradit isEditMode
    }

    if (!isEditMode && machine.currentStateName === 'editRoute') {
      machine.execute('routeSelect', { routeNumber: routeSelectedIndex });
    }
  }, [isEditMode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadPhotoRelatedData();
  }, [splitPaneSize]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadPhotoRelatedData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSplitPaneSizeReset = () => {
    setUserSetting('climbing.splitPaneSize', null);
  };

  React.useEffect(() => {
    window.addEventListener('resize', loadPhotoRelatedData);
    window.addEventListener('orientationchange', loadPhotoRelatedData);

    return () => {
      window.removeEventListener('resize', loadPhotoRelatedData);
      window.removeEventListener('orientationchange', loadPhotoRelatedData);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onDragStarted = () => {
    setIsSplitViewDragging(true);
  };
  const onDragFinished = (splitHeight: number) => {
    setUserSetting('climbing.splitPaneSize', splitHeight);
    setIsSplitViewDragging(false);
  };
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );

  const cragPhotos = getWikimediaCommonsPhotoValues(feature.tags).map(
    removeFilePrefix,
  );
  preparePhotos(cragPhotos);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const resolution = getResolution({
      windowDimensions,
      photoPath,
      photoZoom,
      loadedPhotos,
    });
    setPhotoResolution(resolution);

    const url = getCommonsImageUrl(`File:${photoPath}`, resolution);

    setImageUrl(url);
    if (!backgroundImageUrl && photoPath) {
      setBackgroundImageUrl(url);
    }
  }, [
    backgroundImageUrl,
    loadedPhotos,
    photoPath,
    photoZoom,
    photoZoom.scale,
    windowDimensions,
  ]);

  const showArrowOnTop = splitPaneSize === 0;
  const showArrowOnBottom =
    splitPaneSize === viewportSize.height - editorPosition.y;

  const router = useRouter();
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);

  const isResolutionLoaded =
    loadedPhotos?.[photoPath]?.[photoResolution] || false;
  const resolutions = loadedPhotos?.[photoPath];
  const isFirstPhotoLoaded =
    resolutions &&
    Object.keys(resolutions).filter((key) => resolutions[key] === true).length >
      0;

  console.log('___// loadedPhotos', loadedPhotos);

  const replacePhotoIfNeeded = (photos: string[], selectedIndex: number) => {
    if (!photos.includes(photoPath) && selectedIndex > -1 && !isPhotoLoading) {
      if (photos.length > 0) {
        const featureLink = getOsmappLink(feature);
        router.replace(`${featureLink}/climbing/photo/${photos[0]}`);
        setIsPhotoLoading(true);
      }
    }
  };

  const selectRouteByScroll = (e) => {
    const { scrollTop } = e.target;
    const scrollTopWithOffset = scrollTop + 20 + CLIMBING_ROUTE_ROW_HEIGHT;

    const selectedIndex = routeListTopOffsets.findIndex(
      (offset) =>
        offset <= scrollTopWithOffset &&
        offset + CLIMBING_ROUTE_ROW_HEIGHT >= scrollTopWithOffset,
    );

    const selectedRoute = routes[selectedIndex];
    const photos = selectedRoute?.paths ? Object.keys(selectedRoute.paths) : [];

    if (userSettings['climbing.switchPhotosByScrolling'])
      replacePhotoIfNeeded(photos, selectedIndex);
    if (selectedIndex !== -1) setRouteSelectedIndex(selectedIndex);
  };

  const handleOnScroll = (e) => {
    if (
      userSettings['climbing.selectRoutesByScrolling'] &&
      routeSelectedIndex !== null &&
      !isEditMode
    ) {
      selectRouteByScroll(e);
    }
  };

  return (
    <Container>
      {(showArrowOnTop || showArrowOnBottom) && (
        <ArrowExpanderContainer $cragViewLayout={cragViewLayout}>
          <ArrowExpanderButton $arrowOnTop={showArrowOnTop}>
            <IconButton
              onClick={onSplitPaneSizeReset}
              color="primary"
              size="small"
            >
              {cragViewLayout === 'horizontal' ? (
                <ArrowDownwardIcon fontSize="small" />
              ) : (
                <ArrowForwardIcon fontSize="small" />
              )}
            </IconButton>
          </ArrowExpanderButton>
        </ArrowExpanderContainer>
      )}
      {photoPath ? (
        <SplitPane
          split={cragViewLayout}
          minSize={0}
          maxSize="100%"
          size={splitPaneSize ?? SPLIT_PANE_DEFAULT_SIZE}
          onDragStarted={onDragStarted}
          onDragFinished={onDragFinished}
          pane1Style={
            cragViewLayout === 'vertical'
              ? { maxWidth: 'calc(100vw - 300px)' }
              : { maxHeight: '90%' }
          }
        >
          <BackgroundContainer
            $imageHeight={imageSize.height}
            $imageUrl={backgroundImageUrl}
          >
            <>
              {!isEditMode && (
                <FabContainer>
                  <Tooltip title="Draw routes" enterDelay={1500} arrow>
                    <Fab
                      size="small"
                      color="secondary"
                      aria-label="add"
                      onClick={() => setIsEditMode(true)}
                    >
                      <EditIcon />
                    </Fab>
                  </Tooltip>
                </FabContainer>
              )}

              {(!isResolutionLoaded || isPhotoLoading) && (
                <MiniLoadingContainer>
                  <CircularProgress color="primary" size={14} thickness={6} />
                </MiniLoadingContainer>
              )}
              {!isFirstPhotoLoaded && (
                <FullLoadingContainer>
                  <CircularProgress color="primary" />
                </FullLoadingContainer>
              )}
              <BlurContainer>
                <RouteFloatingMenu />
                <TransformWrapper>
                  <TransformComponent
                    wrapperStyle={{ height: '100%', width: '100%' }}
                    contentStyle={{ height: '100%', width: '100%' }}
                  >
                    <>
                      <RoutesEditor
                        setIsPhotoLoading={setIsPhotoLoading}
                        isPhotoLoading={isPhotoLoading}
                        isRoutesLayerVisible={
                          !isSplitViewDragging && !areRoutesLoading
                        }
                        imageUrl={imageUrl}
                        photoResolution={photoResolution}
                      />
                    </>
                  </TransformComponent>
                </TransformWrapper>
              </BlurContainer>
            </>
          </BackgroundContainer>

          <BottomContainer>
            <FabMapSwitcher
              isMapVisible={isMapVisible}
              setIsMapVisible={setIsMapVisible}
            />
            <BottomPanel onScroll={handleOnScroll}>
              <ClimbingViewContent isMapVisible={isMapVisible} />
            </BottomPanel>
          </BottomContainer>
        </SplitPane>
      ) : (
        <>
          <FabMapSwitcher
            isMapVisible={isMapVisible}
            setIsMapVisible={setIsMapVisible}
          />
          <ClimbingViewContent isMapVisible={isMapVisible} />
        </>
      )}
    </Container>
  );
};
