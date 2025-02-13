import React from 'react';
import styled from '@emotion/styled';

import { useClimbingContext } from '../contexts/ClimbingContext';
import { RouteWithLabel } from './RouteWithLabel';
import { RouteFloatingMenu } from './RouteFloatingMenu';
import { RouteMarks } from './RouteMarks';
import { getMouseFromPositionInImage } from '../utils/mousePositionUtils';
import { DIALOG_TOP_BAR_HEIGHT } from '../config';
import { MockedPoints } from './MockedPoints';

type RouteRenders = { route: React.ReactNode; marks: React.ReactNode };

const Svg = styled.svg<{
  $hasEditableCursor: boolean;
  $imageSize: { width: number; height: number };
  $isVisible: boolean;
  $transformOrigin: any;
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: ${({ $isVisible }) =>
    $isVisible ? 'opacity 0.1s ease' : 'none'};
  transform-origin: 0 0;
  ${({ $hasEditableCursor }) =>
    `cursor: ${$hasEditableCursor ? 'crosshair' : 'auto'}`};
  ${({ $imageSize: { width, height } }) =>
    `width: ${width}px;
    height:${height}px;
    /*height: 100%;*/
    > * {
      -webkit-tap-highlight-color: transparent
    }
    `}
`;

type Props = {
  onClick: (e: any) => void;
  onEditorMouseMove?: (e: any) => void;
  onEditorTouchMove?: (e: any) => void;
  isVisible?: boolean;
  transformOrigin?: any;
};

export const RoutesLayer = ({
  onClick,
  onEditorMouseMove,
  onEditorTouchMove,
  isVisible = true,
  transformOrigin = { x: 0, y: 0 },
}: Props) => {
  const {
    imageSize,
    pointSelectedIndex,
    routeSelectedIndex,
    getMachine,
    isRouteSelected,
    isRouteHovered,
    getPixelPosition,
    isPointMoving,
    setIsPointClicked,
    setIsPointMoving,
    setPointSelectedIndex,
    getCurrentPath,
    routes,
    setIsPanningDisabled,
    svgRef,
  } = useClimbingContext();

  const machine = getMachine();
  const path = getCurrentPath();
  if (!path) return null;

  const onPointInSelectedRouteClick = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    machine.execute('showPointMenu');
    const isDoubleClick = event.detail === 2;
    const lastPointIndex = path.length - 1;

    if (isDoubleClick && pointSelectedIndex === lastPointIndex) {
      machine.execute('finishRoute');
    }
  };

  const handleOnMovingPointDropOnCanvas = () => {
    if (isPointMoving) {
      setPointSelectedIndex(null);
      setIsPointMoving(false);
      setIsPointClicked(false);
      setIsPanningDisabled(false);
    }
  };

  const sortedRoutes = routes.reduce<{
    selected: Array<RouteRenders>;
    rest: Array<RouteRenders>;
    hovered: Array<RouteRenders>;
  }>(
    (acc, route, index) => {
      const RouteInner = () => (
        <RouteWithLabel
          route={route}
          routeNumber={index}
          onPointInSelectedRouteClick={onPointInSelectedRouteClick}
        />
      );
      const RenderRouteMarks = () => (
        <RouteMarks
          route={route}
          routeNumber={index}
          onPointInSelectedRouteClick={onPointInSelectedRouteClick}
        />
      );

      if (isRouteSelected(index)) {
        return {
          ...acc,
          selected: [
            ...acc.selected,
            { route: <RouteInner />, marks: <RenderRouteMarks /> },
          ],
        };
      }
      if (isRouteHovered(index)) {
        return {
          ...acc,
          hovered: [
            ...acc.hovered,
            { route: <RouteInner />, marks: <RenderRouteMarks /> },
          ],
        };
      }
      return {
        ...acc,
        rest: [
          ...acc.rest,
          { route: <RouteInner />, marks: <RenderRouteMarks /> },
        ],
      };
    },
    { selected: [], rest: [], hovered: [] },
  );

  const lastPointOfSelectedRoute =
    routeSelectedIndex !== null && path.length > 0
      ? getPixelPosition(path[path.length - 1])
      : null;

  const selectedPointOfSelectedRoute =
    pointSelectedIndex !== null &&
    path.length > 0 &&
    routes[routeSelectedIndex] &&
    path[pointSelectedIndex]
      ? getPixelPosition(path[pointSelectedIndex])
      : null;

  const routeFloatingMenuPosition =
    machine.currentStateName === 'pointMenu'
      ? selectedPointOfSelectedRoute
      : lastPointOfSelectedRoute;

  return (
    <Svg
      $hasEditableCursor={machine.currentStateName === 'extendRoute'}
      onClick={(e) => {
        onClick(e);
      }}
      onMouseUp={handleOnMovingPointDropOnCanvas}
      onMouseMove={onEditorMouseMove}
      onTouchMove={onEditorTouchMove}
      onPointerMove={onEditorTouchMove}
      $imageSize={imageSize}
      $isVisible={isVisible}
      $transformOrigin={transformOrigin}
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
    >
      {sortedRoutes.rest.map((item) => item.route)}
      {sortedRoutes.rest.map((item) => item.marks)}
      {sortedRoutes.selected.map((item) => item.route)}
      {sortedRoutes.selected.map((item) => item.marks)}
      {sortedRoutes.hovered.map((item) => item.route)}
      {sortedRoutes.hovered.map((item) => item.marks)}

      <MockedPoints />
    </Svg>
  );
};
