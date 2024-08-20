import React from 'react';
import styled from '@emotion/styled';

import EditIcon from '@mui/icons-material/Edit';
import { Button, ButtonGroup } from '@mui/material';
import {
  ClimbingContextProvider,
  useClimbingContext,
} from '../contexts/ClimbingContext';
import { RouteListDndContent } from './RouteListDndContent';
import { invertedBoltCodeMap } from '../utils/boltCodes';
import { PanelLabel } from '../PanelLabel';
import { ContentContainer } from '../ContentContainer';
import { useFeatureContext } from '../../../utils/FeatureContext';
import { isClimbingRelation } from '../../../../utils';
import { getKey } from '../../../../services/helpers';

const Container = styled.div`
  padding-bottom: 20px;
  position: relative; // mobile safari fix
`;
const ButtonContainer = styled.div`
  margin-top: 16px;
  margin-left: 40px;
`;

export const RouteList = ({ isEditable }: { isEditable?: boolean }) => {
  const {
    routes,
    isEditMode,
    setRouteSelectedIndex,
    routeSelectedIndex,
    setIsEditMode,
    routeIndexExpanded,
    setRouteIndexExpanded,
    showDebugMenu,
  } = useClimbingContext();

  React.useEffect(() => {
    const downHandler = (e) => {
      if (routes.length === 0) return;

      if (e.key === 'ArrowDown') {
        const nextRoute = routes[routeSelectedIndex + 1];
        if (nextRoute) {
          setRouteSelectedIndex(routeSelectedIndex + 1);
          e.preventDefault();
        }
      }
      if (e.key === 'ArrowUp') {
        const prevRoute = routes[routeSelectedIndex - 1];
        if (prevRoute) {
          setRouteSelectedIndex(routeSelectedIndex - 1);
          e.preventDefault();
        }
      }
      if (e.key === 'ArrowLeft') {
        if (routeSelectedIndex > -1) {
          setRouteIndexExpanded(routeSelectedIndex);
          e.preventDefault();
        }
      }
      if (e.key === 'ArrowRight') {
        if (routeSelectedIndex) {
          setRouteIndexExpanded(routeSelectedIndex);
          // @TODO: scroll to expanded container:
          // ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [routeSelectedIndex, routes, routeIndexExpanded]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const getRoutesJson = () => {
    // eslint-disable-next-line no-console
    console.log(`____EXPORT JSON`, JSON.stringify(routes));
  };

  const getRoutesCsv = () => {
    const getPathString = (path) =>
      path
        ?.map(
          ({ x, y, type }) =>
            `${x},${y}${type ? invertedBoltCodeMap[type] : ''}`,
        )
        .join('|');

    const getImage = (name: string) => `File:${name}`;

    const object = routes
      .map((route, _idx) => {
        const photos = Object.entries(route.paths);

        return photos.map((photoName) => [
          route.name,
          getImage(photoName?.[0]),
          getPathString(photoName?.[1]),
        ]);
      })
      .flat();
    // eslint-disable-next-line no-console
    console.table(object);
  };

  const mockRoutes = () => {
    // setRoutes();
  };

  return (
    <Container>
      <PanelLabel addition={`${routes.length} routes`}>Routes</PanelLabel>
      {/* {arePointerEventsDisabled ? 'NONE' : 'ALL'} */}
      {routes.length !== 0 && <RouteListDndContent isEditable={isEditable} />}
      <ContentContainer>
        {!isEditMode && isEditable && (
          <ButtonContainer>
            <Button
              onClick={handleEdit}
              color="primary"
              variant="outlined"
              endIcon={<EditIcon />}
            >
              Edit routes
            </Button>
          </ButtonContainer>
        )}
        {showDebugMenu && (
          <>
            <br />
            <ButtonGroup variant="contained" size="small" color="primary">
              <Button size="small" onClick={getRoutesCsv}>
                export OSM
              </Button>
              <Button size="small" onClick={getRoutesJson}>
                export JSON
              </Button>
              <Button size="small" onClick={mockRoutes}>
                Mock
              </Button>
            </ButtonGroup>
          </>
        )}
      </ContentContainer>
    </Container>
  );
};

export const RouteListInPanel = () => {
  const { feature } = useFeatureContext();

  if (
    isClimbingRelation(feature) && // only for this condition is memberFeatures fetched
    feature.tags.climbing === 'crag'
  ) {
    return (
      <ClimbingContextProvider feature={feature} key={getKey(feature)}>
        <RouteList />
      </ClimbingContextProvider>
    );
  }

  return null;
};
