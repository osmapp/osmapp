/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useClimbingContext } from '../../contexts/ClimbingContext';
import { useConfig } from '../../config';
import { useMobileMode } from '../../../../helpers';

const ClickableArea = styled.circle``;

const PointElement = styled.circle<{
  $isHovered: boolean;
  $isPointSelected: boolean;
}>`
  transition: all 0.1s ease-in-out;
  pointer-events: all;
  touch-action: none;
  ${({ $isHovered, $isPointSelected }) =>
    `${
      $isHovered || $isPointSelected
        ? 'transform: scale(1.5);'
        : 'transform: scale(1);'
    }`}
`;

const usePointColor = (type, isHovered) => {
  const config = useConfig();
  const invisiblePointsForTypes = [];

  if (invisiblePointsForTypes.includes(type))
    return { pointColor: 'transparent', pointStroke: 'transparent' };

  if (isHovered)
    return {
      pointColor: config.pathBorderColor,
      pointStroke: config.pathBorderColorSelected,
    };

  return {
    pointColor: config.pathBorderColor,
    pointStroke: config.pathBorderColorSelected,
  };
};

type PointType = {
  x: number;
  y: number;
  onPointInSelectedRouteClick: (e: any) => void;
  type: any;
  index: number;
  routeNumber?: number;
  isRouteSelected: boolean;
  isOtherRouteSelected: boolean;
};

export const Point = ({
  x,
  y,
  onPointInSelectedRouteClick,
  type,
  index,
  routeNumber,
  isRouteSelected,
  isOtherRouteSelected,
}: PointType) => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    setPointSelectedIndex,
    setIsPointMoving,
    setIsPointClicked,
    isPointMoving,
    pointElement,
    setPointElement,
    setRouteIndexHovered,
    photoZoom,
    getCurrentPath,
    setIsPanningDisabled,
    isPointSelected,
    isEditMode,
  } = useClimbingContext();
  const isMobileMode = useMobileMode();
  const { pointColor, pointStroke } = usePointColor(type, isHovered);

  const isPointOnRouteSelected = isRouteSelected && isPointSelected(index);

  const onPointClick = (e) => {
    e.stopPropagation();
  };

  const onPointMouseEnter = () => {
    setIsHovered(true);
    const isLastPoint = getCurrentPath().length - 1 === index;
    if (!isLastPoint && routeNumber) {
      setRouteIndexHovered(routeNumber);
    }
  };

  const onPointMouseLeave = () => {
    setIsHovered(false);
    setRouteIndexHovered(null);
  };

  const onPointMouseDown = (e) => {
    setIsPanningDisabled(true);
    setPointSelectedIndex(index);
    setIsPointClicked(true);
    e.stopPropagation();
  };

  const onPointMouseUp = (e) => {
    // @TODO unify with RouteMarks.tsx
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

  const isTouchDevice = 'ontouchstart' in window;

  const commonProps = {
    onMouseDown: onPointMouseDown,
    onMouseUp: onPointMouseUp,
    onTouchStart: onPointMouseDown,
    onTouchEnd: onPointMouseUp,
    onClick: onPointClick,
    cursor: 'pointer',
    ...(isMobileMode
      ? {}
      : {
          onMouseEnter: onPointMouseEnter,
          onMouseLeave: onPointMouseLeave,
        }),
    cx: 0,
    cy: 0,
  };
  const title = type && <title>{type}</title>;

  if (isOtherRouteSelected && isEditMode)
    return (
      <g transform={`translate(${x},${y}) scale(${1 / photoZoom.scale})`}>
        <circle cx={0} cy={0} r={2.5 * photoZoom.scale} fill="white" />
      </g>
    );
  if (!isRouteSelected || !isEditMode) return null;

  return (
    <g transform={`translate(${x},${y}) scale(${1 / photoZoom.scale})`}>
      <ClickableArea
        fill="transparent"
        r={isTouchDevice ? 20 : 10}
        {...commonProps}
      >
        {title}
      </ClickableArea>

      <PointElement
        fill={pointColor}
        stroke={pointStroke}
        r={isTouchDevice ? 7 : 4}
        $isHovered={isHovered}
        $isPointSelected={isPointOnRouteSelected}
        {...commonProps}
      >
        {title}
      </PointElement>
    </g>
  );
};
