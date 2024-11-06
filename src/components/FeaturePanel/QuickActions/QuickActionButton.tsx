import { forwardRef, MouseEventHandler } from 'react';
import { Chip } from '@mui/material';

type Props = {
  icon: React.FC<{ fontSize: 'small' }>;
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const QuickActionButton = forwardRef<HTMLButtonElement, Props>(
  ({ icon: Icon, label, onClick }, ref) => (
    <Chip
      ref={ref}
      component="button"
      label={label}
      icon={<Icon fontSize="small" />}
      onClick={onClick}
      variant="outlined"
    />
  ),
);
QuickActionButton.displayName = 'QuickActionButton';
