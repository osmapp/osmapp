import IosShare from '@mui/icons-material/IosShare';
import Share from '@mui/icons-material/Share';
import { isIOS } from '../../../../helpers/platforms';
import type { SvgIconProps } from '@mui/material/SvgIcon';

export const ShareIcon = (props: SvgIconProps) =>
  isIOS() ? <IosShare {...props} /> : <Share {...props} />;

export const supportsSharing = () =>
  typeof navigator !== 'undefined' && !!navigator.share;
