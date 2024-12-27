import React from 'react';
import { Bolt } from './Points/Bolt';
import { Piton } from './Points/Piton';
import { Point } from './Points/Point';
import { PulsedPoint } from './Points/PulsedPoint';
import { Sling } from './Points/Sling';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { Anchor } from './Points/Anchor';
import { ClimbingRoute } from '../types';
import { UnfinishedPoint } from './Points/UnfinishedPoint';
import type { type } from 'node:os';

type Props = {
  route: ClimbingRoute;
  routeNumber: number;
  onPointInSelectedRouteClick: (event: React.MouseEvent<any>) => void;
};

export const PointWithType = ({
  onPointClick,
  type,
  x,
  y,
  isOtherRouteSelected,
  isRouteSelected,
  isPointSelected,
  onMarkedPointClick,
  isPulsing,
  isEditMode,
  isWithOffset,
  pointIndex,
  routeNumber,
}) => {
  const xOffset = isWithOffset ? 15 : 0;

  const isBoltVisible = !isOtherRouteSelected && type === 'bolt';
  const isAnchorVisible = !isOtherRouteSelected && type === 'anchor';
  const isSlingVisible = !isOtherRouteSelected && type === 'sling';
  const isPitonVisible = !isOtherRouteSelected && type === 'piton';
  const isUnfinishedPointVisible =
    !isOtherRouteSelected && type === 'unfinished';

  const pointerEvents = isRouteSelected || isEditMode ? 'auto' : 'none';
  return (
    <React.Fragment>
      {isPulsing && <PulsedPoint x={x} y={y} />}

      {isBoltVisible && (
        <Bolt
          x={x + xOffset}
          y={y}
          isPointSelected={isPointSelected}
          pointerEvents={pointerEvents}
          onClick={onMarkedPointClick}
        />
      )}
      {isPitonVisible && (
        <Piton
          x={x + xOffset}
          y={y}
          isPointSelected={isPointSelected}
          pointerEvents={pointerEvents}
          onClick={onMarkedPointClick}
        />
      )}
      {isSlingVisible && (
        <Sling
          x={x}
          y={y}
          isPointSelected={isPointSelected}
          pointerEvents={pointerEvents}
          onClick={onMarkedPointClick}
        />
      )}
      {isAnchorVisible && (
        <Anchor
          x={x + xOffset}
          y={y}
          isPointSelected={isPointSelected}
          pointerEvents={pointerEvents}
          onClick={onMarkedPointClick}
        />
      )}
      {isUnfinishedPointVisible && (
        <UnfinishedPoint
          x={x + xOffset}
          y={y}
          isPointSelected={isPointSelected}
          pointerEvents={pointerEvents}
          onClick={onMarkedPointClick}
        />
      )}
      <Point
        x={x}
        y={y}
        type={type}
        isRouteSelected={isRouteSelected}
        isOtherRouteSelected={isOtherRouteSelected}
        onPointInSelectedRouteClick={onPointClick}
        index={pointIndex}
        routeNumber={routeNumber}
      />
    </React.Fragment>
  );
};

export const RouteMarks = ({
  route,
  routeNumber,
  onPointInSelectedRouteClick,
}: Props) => {
  const {
    getPixelPosition,
    isPointSelected,
    getMachine,
    getPathForRoute,
    isRouteSelected,
    pointElement,
    isPointMoving,
    setPointElement,
    setPointSelectedIndex,
    setIsPointMoving,
    setIsPointClicked,
    isOtherRouteSelected,
    isEditMode,
    setRouteIndexHovered,
  } = useClimbingContext();
  const isSelected = isRouteSelected(routeNumber);
  const isOtherSelected = isOtherRouteSelected(routeNumber);
  return (
    <>
      {getPathForRoute(route).map(({ x, y, type }, index) => {
        const onMarkedPointClick = (e: any) => {
          // @TODO unify with Point.tsx
          if (!isPointMoving) {
            onPointInSelectedRouteClick(e);
            setPointElement(pointElement !== null ? null : e.currentTarget);
            setPointSelectedIndex(index);
            setIsPointMoving(false);
            setIsPointClicked(false);
            e.stopPropagation();
            e.preventDefault();
          }
        };

        const position = getPixelPosition({ x, y, units: 'percentage' });

        const machine = getMachine();
        const isThisRouteEditOrExtendMode =
          (machine.currentStateName === 'extendRoute' ||
            machine.currentStateName === 'pointMenu' ||
            machine.currentStateName === 'editRoute') &&
          isSelected;

        return (
          // eslint-disable-next-line react/no-array-index-key
          <PointWithType
            isOtherRouteSelected={isOtherSelected}
            isRouteSelected={isSelected}
            isPointSelected={isRouteSelected && isPointSelected(index)}
            isWithOffset={isSelected && isEditMode}
            isPulsing={isThisRouteEditOrExtendMode}
            onMarkedPointClick={onMarkedPointClick}
            x={position.x}
            y={position.y}
            key={`${routeNumber}-${index}-${x}-${y}`}
            isEditMode={isEditMode}
            type={type}
            onPointClick={onPointInSelectedRouteClick}
            pointIndex={index}
            routeNumber={routeNumber}
          />
        );
      })}
    </>
  );
};
