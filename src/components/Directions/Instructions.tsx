import styled from '@emotion/styled';
import { icon, Sign } from './routing/instructions';
import { RoutingResult } from './routing/types';
import { useUserSettingsContext } from '../utils/UserSettingsContext';
import { toHumanDistance } from './helpers';
import { Stack, Typography } from '@mui/material';

type Instruction = RoutingResult['instructions'][number];

const Distance = ({ distance }: { distance: number }) => {
  const { userSettings } = useUserSettingsContext();
  const { isImperial } = userSettings;

  return <>{toHumanDistance(isImperial, distance)}</>;
};

const Icon = ({ sign }: { sign: Sign }) => {
  const Component = icon(sign);
  return <Component fontSize="large" />;
};

const StyledListItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Instruction = ({ instruction }: { instruction: Instruction }) => (
  <StyledListItem>
    <Stack direction="row" alignItems="center">
      <Icon sign={instruction.sign} />
      {instruction.street_name || instruction.text}
    </Stack>
    {instruction.distance > 0 && (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography
          noWrap
          color="textSecondary"
          variant="body1"
          style={{ overflow: 'visible' }}
        >
          <Distance distance={instruction.distance} />
        </Typography>
        <hr style={{ width: '100%' }} />
      </Stack>
    )}
  </StyledListItem>
);

const StyledList = styled.ul`
  list-style: none;
  padding: 0;

  max-height: 100%;

  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

type Props = {
  instructions: Instruction[];
};

export const Instructions = ({ instructions }: Props) => (
  <StyledList>
    {instructions.map((instruction) => (
      <Instruction key={instruction.text} instruction={instruction} />
    ))}
  </StyledList>
);