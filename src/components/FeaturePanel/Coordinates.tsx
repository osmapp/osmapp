import React, { forwardRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import styled from 'styled-components';
import { Divider, Menu, MenuItem } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { useMapStateContext } from '../utils/MapStateContext';
import { isMobileDevice, useBoolState } from '../helpers';
import { useFeatureContext } from '../utils/FeatureContext';
import { getIdEditorLink, positionToDeg, positionToDM } from '../../utils';
import { PositionBoth } from '../../services/types';
import { getFullOsmappLink, getShortLink } from '../../services/helpers';
import { t } from '../../services/intl';

const StyledMenuItem = styled(MenuItem)`
  svg {
    font-size: 12px;
    color: #bbb;
    margin: -7px 0 0 5px;
  }

  &:focus {
    text-decoration: none;
    svg {
      outline: 0;
    }
  }
`;

const StyledToggleButton = styled(IconButton)`
  position: absolute !important;
  margin: -10px 0 0 -10px !important;

  svg {
    font-size: 17px;
  }
`;

export const ToggleButton = forwardRef<any, any>(
  ({ onClick, isShown = false }, ref) => (
    <StyledToggleButton onClick={onClick} aria-label="Toggle">
      {!isShown && <ExpandMoreIcon fontSize="small" ref={ref} />}
      {isShown && <ExpandLessIcon fontSize="small" ref={ref} />}
    </StyledToggleButton>
  ),
);

const CopyTextItem = ({ text }: { text: string | null }) =>
  text === null ? null : (
    <MenuItem onClick={() => navigator.clipboard.writeText(text)}>
      {t('coordinates.copy_value', {
        value: text.replace(/^https:\/\//, ''),
      })}
    </MenuItem>
  );

const LinkItem = ({ href, label }) => (
  <StyledMenuItem component="a" href={href} target="_blank" rel="noopener">
    {label} <OpenInNewIcon />
  </StyledMenuItem>
);

// Our map uses 512 tiles, so our zoom is "one less"
// https://wiki.openstreetmap.org/wiki/Zoom_levels#Mapbox_GL
const MAPLIBREGL_ZOOM_DIFFERENCE = 1;

const useGetItems = ([lon, lat]: PositionBoth) => {
  const { feature } = useFeatureContext();
  const { view } = useMapStateContext();
  const [ourZoom] = view;

  const zoom = parseFloat(ourZoom) + MAPLIBREGL_ZOOM_DIFFERENCE;
  const zoomInt = Math.round(zoom);
  const osmQuery = feature?.osmMeta?.id
    ? `${feature.osmMeta.type}/${feature.osmMeta.id}`
    : `?mlat=${lat}&mlon=${lon}&zoom=${zoomInt}`;

  return [
    {
      label: 'OpenStreetMap.org',
      href: `https://openstreetmap.org/${osmQuery}`,
    },
    {
      label: 'OpenStreetMap.cz',
      href: `https://openstreetmap.cz/${osmQuery}`,
    },
    {
      label: 'Mapy.cz',
      href: `https://mapy.cz/zakladni?q=${lat}%C2%B0%20${lon}%C2%B0`,
    },
    {
      label: 'Google Maps',
      href: `https://google.com/maps/search/${lat}%C2%B0%20${lon}%C2%B0/@${lat},${lon},${zoomInt}z`,
    },
    {
      label: 'iD editor',
      href: getIdEditorLink(feature, view), // TODO coordsFeature has random id which gets forwarded LOL
    },
    ...(isMobileDevice()
      ? [
          {
            label: t('coordinates.geo_uri'),
            href: `geo:${lat},${lon}`,
          },
        ]
      : []),
  ];
};

type Props = { coords: PositionBoth };

export const Coords = ({ coords }: Props) => {
  const [opened, open, close] = useBoolState(false);
  const anchorRef = React.useRef();
  const items = useGetItems(coords);
  const { feature } = useFeatureContext();
  const osmappLink = getFullOsmappLink(feature);
  const shortLink = getShortLink(feature);

  return (
    <span title="latitude, longitude (y, x)" ref={anchorRef}>
      {positionToDeg(coords)}
      {feature.countryCode && ` (${feature.countryCode.toUpperCase()})`}
      <Menu
        anchorEl={anchorRef.current}
        open={opened}
        onClose={close}
        disableAutoFocusItem
      >
        {items.map(({ label, href }) => (
          <LinkItem key={label} href={href} label={label} />
        ))}
        <Divider />
        <CopyTextItem text={positionToDeg(coords)} />
        <CopyTextItem text={positionToDM(coords)} />
        <CopyTextItem text={osmappLink} />
        <CopyTextItem text={shortLink} />
      </Menu>
      <ToggleButton onClick={open} />
    </span>
  );
};

const Coordinates = () => {
  const { feature } = useFeatureContext();
  const { center, roundedCenter = undefined } = feature;
  const coords = roundedCenter ?? center;
  return coords ? <Coords coords={coords} /> : null;
};

export default Coordinates;
