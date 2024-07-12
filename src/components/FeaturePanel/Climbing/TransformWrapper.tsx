import React from 'react';
import { TransformWrapper as Wrapper } from 'react-zoom-pan-pinch';
import { useClimbingContext } from './contexts/ClimbingContext';

export const TransformWrapper = ({ children }) => {
  const { setArePointerEventsDisabled, setPhotoZoom } = useClimbingContext();

  const startPointerEvents = () => {
    setArePointerEventsDisabled(false);
  };
  const stopPointerEvents = () => {
    setArePointerEventsDisabled(true);
  };

  return (
    <Wrapper
      doubleClick={{
        disabled: true,
      }}
      onWheelStart={stopPointerEvents}
      onWheelStop={startPointerEvents}
      onPinchingStart={stopPointerEvents}
      onPinchingStop={startPointerEvents}
      onZoomStart={stopPointerEvents}
      onZoomStop={startPointerEvents}
      onPanningStart={startPointerEvents}
      onPanningStop={startPointerEvents}
      disablePadding
      wheel={{ step: 100 }}
      centerOnInit
      onTransformed={(
        _ref,
        state: {
          scale: number;
          positionX: number;
          positionY: number;
        },
      ) => {
        setPhotoZoom(state);
      }}
    >
      {children}
    </Wrapper>
  );
};
