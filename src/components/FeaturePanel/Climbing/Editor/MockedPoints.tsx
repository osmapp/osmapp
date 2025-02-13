import React from 'react';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { machine } from 'node:os';
import { PointWithType } from './PointWithType';

const data = [
  {
    x: 0.1,
    y: 0.4,
    type: 'piton',
    units: 'percentage' as const,
  },
  {
    x: 0.2,
    y: 0.5,
    type: 'bolt',
    units: 'percentage' as const,
  },
];

export const MockedPoints = () => {
  const { isEditMode, getPixelPosition, mockedPoints, getMachine } =
    useClimbingContext();
  const machine = getMachine();

  console.log('___', mockedPoints);
  return (
    <>
      {mockedPoints.map((point) => {
        const position = getPixelPosition({
          x: point.x,
          y: point.y,
          units: 'percentage',
        });

        return (
          <PointWithType
            key={`mocked-point-${point.x}-${point.y}`}
            isOtherRouteSelected={false}
            isRouteSelected={true}
            isPointSelected={true}
            isWithOffset={isEditMode}
            isPulsing={false}
            onMarkedPointClick={() => {}}
            x={position.x}
            y={position.y}
            isEditMode={isEditMode}
            type={point.type}
            onPointClick={() => {
              console.log('___!!');
              machine.execute('showPointMenu');
            }}
            pointIndex={0}
          />
        );
      })}
    </>
  );
};
