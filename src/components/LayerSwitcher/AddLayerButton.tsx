import React from 'react';
import { Box, Button } from '@mui/material';
import { Layer, useMapStateContext } from '../utils/MapStateContext';
import { t } from '../../services/intl';
import { AddCustomDialog } from './AddCustomLayer';
import { LayerIndexAttribution } from './helpers/loadLayers';

const fmtAttributionHtml = ({ url, html, text }: LayerIndexAttribution) => {
  if (html) return html;
  if (text && url) return `<a href="${url}">${text}</a>`;
  return text || url;
};

export const AddUserLayerButton = () => {
  const { setActiveLayers, setUserLayers } = useMapStateContext();
  const [isOpen, setOpen] = React.useState(false);

  return (
    <>
      <Box m={2} mt={6}>
        <Button size="small" color="secondary" onClick={() => setOpen(true)}>
          {t('layerswitcher.add_layer_button')}
        </Button>
      </Box>

      <AddCustomDialog
        onClose={() => setOpen(false)}
        isOpen={isOpen}
        save={(layer) => {
          const {
            url,
            name,
            max_zoom: maxzoom,
            min_zoom: minzoom,
            attribution,
            bbox: bboxes,
          } = layer;

          const newLayer: Layer = {
            type: 'user',
            maxzoom,
            minzoom,
            name,
            url,
            bboxes,
            ...(attribution && {
              attribution: [fmtAttributionHtml(attribution)],
            }),
          };

          setUserLayers((current) => {
            const userLayersOmitSame = current.filter(
              (item) => item.url !== url,
            );

            return [...userLayersOmitSame, newLayer];
          });
          setActiveLayers([url]); // if this not found in osmappLayers, value is used as tiles URL
        }}
      />
    </>
  );
};
