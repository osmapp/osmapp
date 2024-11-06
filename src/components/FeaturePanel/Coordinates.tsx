import React from 'react';
import { useFeatureContext } from '../utils/FeatureContext';
import { positionToDeg } from '../../utils';
import { PositionBoth } from '../../services/types';

type Props = { coords: PositionBoth };

export const Coords = ({ coords }: Props) => {
  const anchorRef = React.useRef();
  const { feature } = useFeatureContext();

  return (
    <span title="latitude, longitude (y, x)" ref={anchorRef}>
      {positionToDeg(coords)}
      {feature.countryCode && ` (${feature.countryCode.toUpperCase()})`}
    </span>
  );
};

const Coordinates = () => {
  const { feature } = useFeatureContext();
  const { center, roundedCenter = undefined } = feature;
  const coords = roundedCenter ?? center;
  return coords ? <Coords coords={coords} /> : null;
};

export default Coordinates;
