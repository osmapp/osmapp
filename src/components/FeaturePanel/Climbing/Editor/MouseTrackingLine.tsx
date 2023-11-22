import React from 'react';
import { PathWithBorder } from './PathWithBorder';
import { useClimbingContext } from '../contexts/ClimbingContext';

export const MouseTrackingLine = ({ routeNumber }) => {
  const {
    mousePosition,
    isRouteSelected,
    getPixelPosition,
    getPercentagePosition,
    routes,
    findClosestPoint,
    getPositionWithoutEditor,
  } = useClimbingContext();

  const route = routes[routeNumber];
  const lastPoint = route.path[route.path.length - 1];
  const lastPointPositionInPx = getPixelPosition(lastPoint);
  const mousePositionWithEditorPosition =
    getPositionWithoutEditor(mousePosition);
  const closerMousePositionPoint = mousePositionWithEditorPosition
    ? findClosestPoint(getPercentagePosition(mousePositionWithEditorPosition))
    : null;
  const mousePosition2 = closerMousePositionPoint
    ? getPixelPosition(closerMousePositionPoint)
    : mousePositionWithEditorPosition;
  console.log(
    '____',
    mousePositionWithEditorPosition,
    closerMousePositionPoint,
  );

  const isSelected = isRouteSelected(routeNumber);
  return (
    mousePosition2 &&
    isSelected && (
      <PathWithBorder
        d={`M ${lastPointPositionInPx.x} ${lastPointPositionInPx.y} L ${mousePosition2.x} ${mousePosition2.y}`}
        isSelected={isSelected}
        pointerEvents="none"
        opacity={0.4}
        // markerEnd={isSelected ? 'url(#triangle)' : null}
      />
    )
  );
};
