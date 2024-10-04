import React from 'react';
import { LineInformation } from './requestRoutes';
import { LineNumber } from './LineNumber';
import { t } from '../../../services/intl';

const PublicTransportWrapper = ({ children }) => {
  const divStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    justifyContent: 'start',
    gap: '0.5rem',
    flexWrap: 'wrap',
  };

  return <div style={divStyle}>{children}</div>;
};

// TODO: Do this using the id-tagging-presets
const fmtCategory = (category: string) => {
  switch (category) {
    case 'tourism':
      return t('publictransport.tourism');
    case 'night':
      return t('publictransport.night');
    case 'car_shuttle':
      return t('publictransport.car_shuttle');
    case 'car':
      return t('publictransport.car');
    case 'commuter':
      return t('publictransport.commuter');
    case 'regional':
      return t('publictransport.regional');
    case 'long_distance':
      return t('publictransport.long_distance');
    case 'high_speed':
      return t('publictransport.high_speed');
    case 'bus':
      return t('publictransport.bus');
    case 'unknown':
      return t('publictransport.unknown');
    default:
      return category;
  }
};

interface CategoryProps {
  category: string;
  lines: LineInformation[];
  showHeading: boolean;
}

export const PublicTransportCategory: React.FC<CategoryProps> = ({
  category,
  lines,
  showHeading,
}) => (
  <>
    {showHeading && <h4>{fmtCategory(category)}</h4>}
    <PublicTransportWrapper>
      {lines.map((line) => (
        <LineNumber
          key={line.ref}
          name={line.ref}
          color={line.colour}
          osmType={line.osmType}
          osmId={line.osmId}
        />
      ))}
    </PublicTransportWrapper>
  </>
);
