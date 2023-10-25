import React from 'react';
import { WikipediaIcon } from '../../../assets/WikipediaIcon';
import { renderValue } from '../TagsTable/renderValue';

export const WikipediaRenderer = ({ k, v }) => (
  <>
    <WikipediaIcon width={20} height={20} />
    {renderValue(k, v)}
  </>
);
