import React from 'react';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { ClimbingRoute } from '../types';
import { PointWithType } from './PointWithType';

type Props = {
  route: ClimbingRoute;
  routeNumber: number;
  onPointInSelectedRouteClick: (event: React.MouseEvent<any>) => void;
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
            key={`${routeNumber}-${index}-${x}-${y}`}
            isOtherRouteSelected={isOtherSelected}
            isRouteSelected={isSelected}
            isPointSelected={isRouteSelected && isPointSelected(index)}
            isWithOffset={isSelected && isEditMode}
            isPulsing={isThisRouteEditOrExtendMode}
            onMarkedPointClick={onMarkedPointClick}
            x={position.x}
            y={position.y}
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
