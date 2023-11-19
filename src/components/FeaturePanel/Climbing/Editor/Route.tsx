import React from 'react';
import type { ClimbingRoute } from '../types';
import { Belay } from './BelayPoint';
import { Bolt } from './BoltPoint';
import { Point } from './Point';
import { PulsedPoint } from './PulsedPoint';
import { RoutePath } from './RoutePath';
import { useClimbingContext } from '../contexts/ClimbingContext';

type Props = {
  route: ClimbingRoute;
  routeNumber: number;
  onPointClick: (event: React.MouseEvent<any>) => void;
};

export const Route = ({ route, routeNumber, onPointClick }: Props) => {
  const { getPixelPosition, isRouteSelected, useMachine } =
    useClimbingContext();

  const machine = useMachine();
  const isSelected = isRouteSelected(routeNumber);
  const isThisRouteEditOrExtendMode =
    (machine.currentStateName === 'extendRoute' ||
      machine.currentStateName === 'editRoute') &&
    isSelected;
  // move defs
  return (
    <>
      <defs>
        <marker
          id="triangle"
          viewBox="0 0 10 10"
          refX="-5"
          refY="5"
          markerUnits="strokeWidth"
          markerWidth="4"
          markerHeight="4"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="white" />
        </marker>
      </defs>
      <RoutePath route={route} routeNumber={routeNumber} />

      {route.path.map(({ x, y, type }, index) => {
        const isBoltVisible = type === 'bolt';
        const isBelayVisible = type === 'belay';
        const position = getPixelPosition({ x, y });

        return (
          <>
            {isThisRouteEditOrExtendMode && <PulsedPoint x={x} y={y} />}
            {isBoltVisible && (
              <Bolt x={position.x} y={position.y} isSelected={isSelected} />
            )}
            {isBelayVisible && (
              <Belay x={position.x} y={position.y} isSelected={isSelected} />
            )}
            {isThisRouteEditOrExtendMode && (
              <Point
                x={position.x}
                y={position.y}
                type={type}
                onPointClick={onPointClick}
                index={index}
                routeNumber={routeNumber}
              />
            )}
          </>
        );
      })}
    </>
  );
};
