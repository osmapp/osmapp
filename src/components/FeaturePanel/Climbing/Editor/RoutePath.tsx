/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import styled from 'styled-components';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { Position } from '../types';
import { PathWithBorder } from './PathWithBorder';
import { MouseTrackingLine } from './MouseTrackingLine';

const InteractiveArea = styled.line``;
const AddNewPoint = styled.circle`
  pointer-events: none;
  cursor: copy;
`;

export const RoutePath = ({ route, routeNumber }) => {
  const [isHovered, setIsHovered] = useState(false);
  // const [isDraggingPoint, setIsDraggingPoint] = useState(false);
  const [tempPointPosition, setTempPointPosition] = useState<
    Position & { lineIndex: number }
  >({
    x: 0,
    y: 0,
    lineIndex: 0,
  });
  const {
    routeSelectedIndex,
    editorPosition,
    updateRouteOnIndex,
    isPointMoving,
    isRouteSelected,
    // setPointSelectedIndex,
    // setIsPointMoving,
    getPixelPosition,
    getPercentagePosition,
    useMachine,
    scrollOffset,
  } = useClimbingContext();
  const isSelected = isRouteSelected(routeNumber);
  const machine = useMachine();
  const pointsInString = route?.path.map(({ x, y }, index) => {
    const position = getPixelPosition({ x, y });

    return `${index === 0 ? 'M' : 'L'}${position.x} ${position.y} `;
  });

  const onMouseMove = (e, lineIndex: number) => {
    if (machine.currentStateName === 'editRoute') {
      if (!isHovered) setIsHovered(true);
      setTempPointPosition({
        x: e.clientX - editorPosition.x,
        y: e.clientY - editorPosition.y,
        lineIndex,
      });
    }
    // if (isDraggingPoint) {
    //   setPointSelectedIndex(tempPointPosition.lineIndex + 1);
    //   setIsPointMoving(true);
    // }
  };
  const onMouseEnter = () => {
    console.log('__ENTER');
    if (machine.currentStateName === 'editRoute') {
      setIsHovered(true);
    }
  };

  const onMouseLeave = () => {
    if (machine.currentStateName === 'editRoute') {
      setIsHovered(false);
    }
  };
  // const onMouseUp = () => {
  //   console.log('____onMouseUp');
  //   setIsDraggingPoint(false);
  // };

  const hoveredPosition = {
    x: scrollOffset.x + tempPointPosition.x,
    y: scrollOffset.y + tempPointPosition.y,
  };

  const onPointAdd = () => {
    machine.execute('addPoint');
    const position = getPercentagePosition(hoveredPosition);

    updateRouteOnIndex(routeSelectedIndex, (currentRoute) => ({
      ...currentRoute,
      path: [
        ...currentRoute.path.slice(0, tempPointPosition.lineIndex + 1),
        position,
        ...currentRoute.path.slice(tempPointPosition.lineIndex + 1),
      ],
    }));
  };

  const onMouseDown = (e) => {
    console.log('____onMouseDown');
    // setIsDraggingPoint(true);
    onPointAdd();

    e.stopPropagation();
    // e.preventDefault();
  };

  const isEditableSelectedRouteHovered =
    !isPointMoving &&
    machine.currentStateName === 'editRoute' &&
    isSelected &&
    isHovered;

  const isInteractionDisabled =
    machine.currentStateName === 'extendRoute' && !isRouteSelected(routeNumber);

  const commonProps = isEditableSelectedRouteHovered
    ? { cursor: 'copy' }
    : {
        onClick: (e) => {
          console.log('___//', isInteractionDisabled);
          if (isInteractionDisabled) return;
          machine.execute('routeSelect', { routeNumber });
          e.stopPropagation();
        },
        cursor: isInteractionDisabled ? undefined : 'pointer',
      };

  console.log('___', isHovered);
  return (
    <>
      <PathWithBorder
        d={`M0 0 ${pointsInString}`}
        isSelected={isSelected}
        {...commonProps}
      />

      {/* <RouteBorder
        d={`M0 0 ${pointsInString}`}
        strokeWidth={5}
        stroke={isSelected ? 'white' : '#666'}
        strokeLinecap="round"
        fill="none"
        opacity={0.8}
        {...commonProps}
      />
      <RouteLine
        d={`M0 0 ${pointsInString}`}
        strokeWidth={3}
        stroke={isSelected ? 'royalblue' : 'white'}
        strokeLinecap="round"
        fill="none"
        // markerEnd={
        //   isSelected && machine.currentStateName === 'extendRoute' ? 'url(#triangle)' : null
        // }
        {...commonProps}
      /> */}
      {route.path.length > 1 &&
        route.path.map(({ x, y }, index) => {
          const position1 = getPixelPosition({ x, y });

          if (
            route?.path &&
            index < route.path.length - 1 &&
            !isInteractionDisabled
          ) {
            const position2 = getPixelPosition(route.path[index + 1]);
            return (
              <InteractiveArea
                stroke="transparent"
                strokeWidth={20}
                x1={position1.x}
                y1={position1.y}
                x2={position2.x}
                y2={position2.y}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseMove={(e) => onMouseMove(e, index)}
                // onMouseDown={onMouseDown}
                onClick={onMouseDown}
                // onMouseUp={onMouseUp}
                {...commonProps}
              />
            );
          }
          return null;
        })}
      {isEditableSelectedRouteHovered && (
        <AddNewPoint
          cx={hoveredPosition.x}
          cy={hoveredPosition.y}
          fill="white"
          stroke="rgba(0,0,0,0.3)"
          r={5}
        />
      )}
      {machine.currentStateName === 'extendRoute' && !isHovered && (
        <MouseTrackingLine routeNumber={routeNumber} />
      )}
    </>
  );
};