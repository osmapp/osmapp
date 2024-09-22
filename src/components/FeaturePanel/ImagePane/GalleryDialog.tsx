import React from 'react';
import { ImageDef } from '../../../services/types';
import {
  getImageDefId,
  ImageType,
} from '../../../services/images/getImageDefs';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ImageList,
  ImageListItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getLabel } from '../../../helpers/featureLabel';

type GalleryDialogProps = {
  images: ImageType[];
  def: ImageDef;
  opened: boolean;
  onClose: () => void;
};

export const GalleryDialog: React.FC<GalleryDialogProps> = ({
  images,
  def,
  opened,
  onClose,
}) => {
  const { feature } = useFeatureContext();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const cols = useMediaQuery(theme.breakpoints.up('md')) ? 3 : 2;

  if (images.length <= 4) {
    return null;
  }

  return (
    <Dialog open={opened} fullScreen={fullScreen} maxWidth="md">
      <DialogTitle>Images for {getLabel(feature)}</DialogTitle>
      <DialogContent>
        <ImageList variant="masonry" cols={cols} gap={4}>
          {images.map((img) => (
            <ImageListItem key={img.imageUrl}>
              <img src={img.imageUrl} alt={getImageDefId(def)} loading="lazy" />
            </ImageListItem>
          ))}
        </ImageList>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
