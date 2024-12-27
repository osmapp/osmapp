import React from 'react';
import { PulsedPoint } from './Points/PulsedPoint';
import { Bolt } from './Points/Bolt';
import { Piton } from './Points/Piton';
import { Sling } from './Points/Sling';
import { Anchor } from './Points/Anchor';
import { UnfinishedPoint } from './Points/UnfinishedPoint';
import { Point } from './Points/Point';

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
