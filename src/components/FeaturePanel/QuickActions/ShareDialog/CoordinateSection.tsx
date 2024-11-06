import { MenuItem, Select } from '@mui/material';
import { positionToDeg, positionToDM } from '../../../../utils';
import { useFeatureContext } from '../../../utils/FeatureContext';
import React from 'react';
import { Adornment } from './Adornment';
import styled from '@emotion/styled';
import { t } from '../../../../services/intl';

const useCoords = () => {
  const { feature } = useFeatureContext();
  const center = feature.roundedCenter ?? feature.center;

  return {
    deg: positionToDeg(center),
    dm: positionToDM(center),
  };
};

const StyledSelect = styled(Select<string>)`
  height: 3.5rem;
  width: 100%;
  background-color: ${(props) => props.theme.palette.action.hover};
  font-family: monospace;
  & .MuiSelect-icon {
    position: static;
  }
  &:hover {
    background-color: ${(props) => props.theme.palette.action.selected};
  }
`;

export const CoordinateSection = () => {
  const { deg, dm } = useCoords();
  const [selected, setSelected] = React.useState(deg);

  return (
    <section>
      <h3>{t('sharedialog.coordinates')}</h3>
      <StyledSelect
        value={selected}
        onChange={({ target }) => {
          setSelected(target.value);
        }}
        endAdornment={<Adornment payload={selected} type="text" />}
      >
        <MenuItem value={deg}>{deg}</MenuItem>
        <MenuItem value={dm}>{dm}</MenuItem>
      </StyledSelect>
    </section>
  );
};
