import styled from '@emotion/styled';
import { Paper, PaperProps, Popper, PopperProps } from '@mui/material';

export const OptionsPaper = styled(Paper)<PaperProps>`
  background-color: ${({ theme }) => theme.palette.background.searchInput};
  -webkit-backdrop-filter: blur(35px);
  backdrop-filter: blur(35px);
`;

export const OptionsPopper = styled(Popper)<PopperProps>`
  padding-top: 5px;
`;
