import React from 'react';
import { t } from '../../../../services/intl';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
} from '@mui/material';
import {
  MoreHoriz,
  Search,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

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
    case 'subway':
      return t('publictransport.subway');
    case 'unknown':
      return t('publictransport.unknown');
    default:
      return category;
  }
};

const ToggleCategory = ({
  shown,
  onClick,
}: {
  shown: boolean;
  onClick?: React.MouseEventHandler<HTMLLIElement>;
}) => (
  <MenuItem onClick={onClick}>
    <ListItemIcon>
      {shown && <VisibilityOff fontSize="small" />}
      {!shown && <Visibility fontSize="small" />}
    </ListItemIcon>
    <ListItemText>
      {shown
        ? t('publictransport.hide_this_category')
        : t('publictransport.show_this_category')}
    </ListItemText>
  </MenuItem>
);

type Props = {
  category: string;
  shownCategories: string[];
  onChange: (categories: string[]) => void;
};

export const CategoryHeading = ({
  category,
  shownCategories,
  onChange,
}: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(
    null,
  );
  const isShownOnMap = shownCategories.includes(category);

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center" mb={1}>
        <h4>{fmtCategory(category)}</h4>
        <IconButton
          onClick={({ currentTarget }) => {
            setAnchorEl(currentTarget);
          }}
        >
          <MoreHoriz />
        </IconButton>
      </Stack>
      <Menu
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      >
        <ToggleCategory
          shown={isShownOnMap}
          onClick={() => {
            const newCategories = isShownOnMap
              ? shownCategories.filter((cat) => cat !== category)
              : shownCategories.concat(category);
            onChange(newCategories);
            setAnchorEl(null);
          }}
        />
        <MenuItem
          onClick={() => {
            onChange([category]);
            setAnchorEl(null);
          }}
          disabled={isShownOnMap && shownCategories.length === 1}
        >
          <ListItemIcon>
            <Search fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('publictransport.only_this_category')}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
