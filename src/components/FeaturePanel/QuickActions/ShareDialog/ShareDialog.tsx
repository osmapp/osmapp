import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { t } from '../../../../services/intl';
import { LinkSection } from './LinkSection';
import { CoordinateSection } from './CoordinateSection';
import { OpenInSection } from './OpenInSection';
import { ImageAttribution } from './ImageAttribution';

type Props = {
  open: boolean;
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
};

export const ShareDialog = ({ open, onClose }: Props) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>{t('featurepanel.share_button')}</DialogTitle>
      <DialogContent>
        <LinkSection />
        <CoordinateSection />
        <OpenInSection />
        <ImageAttribution />
      </DialogContent>
    </Dialog>
  );
};
