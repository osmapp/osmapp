import React from 'react';
import { LineInformation } from './requestRoutes';
import { LineNumber } from './LineNumber';
import { CategoryHeading } from './CategoryHeading';

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

interface CategoryProps {
  category: string;
  shownCategories: string[];
  lines: LineInformation[];
  showHeading: boolean;
  onChange: (categories: string[]) => void;
}

export const PublicTransportCategory: React.FC<CategoryProps> = ({
  category,
  lines,
  shownCategories,
  showHeading,
  onChange,
}) => (
  <>
    {showHeading && (
      <CategoryHeading
        category={category}
        shownCategories={shownCategories}
        onChange={onChange}
      />
    )}
    <PublicTransportWrapper>
      {lines.map((line) => (
        <LineNumber key={line.ref} line={line} />
      ))}
    </PublicTransportWrapper>
  </>
);
