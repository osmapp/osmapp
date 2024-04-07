import React from 'react';
import styled from 'styled-components';
import CheckIcon from '@material-ui/icons/Check';
import { useClimbingContext } from './contexts/ClimbingContext';
import { isAscent } from './utils/ascents';

const Text = styled.div``;
const Container = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 22px;
  align-items: center;
  padding: 2px 8px;
  background-color: ${({ theme }) => theme.palette.climbing.ascent};
  font-size: 13px;
  font-weight: 900;
  gap: 4px;
`;

export const YellowedBadge = () => {
  const { routes } = useClimbingContext();
  const isVisible = routes.every((route) => {
    const osmId = route.feature?.osmMeta.id ?? null;
    return isAscent(osmId);
  });

  return isVisible ? (
    <Container>
      <CheckIcon fontSize="small" />
      <Text>Vyžluceno</Text>
    </Container>
  ) : null;
};
