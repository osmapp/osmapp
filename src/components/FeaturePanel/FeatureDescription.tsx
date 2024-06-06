import React from 'react';
import styled from 'styled-components';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Box, Tooltip, Grid, Typography } from '@mui/material';
import { capitalize, isMobileDevice, useToggleState } from '../helpers';
import { t, Translation } from '../../services/intl';
import { useFeatureContext } from '../utils/FeatureContext';

const StyledIconButton = styled(IconButton)`
  position: absolute !important; /* TODO mui styles takes precendence, why? */
  margin-top: -5px !important;

  svg {
    font-size: 17px;
  }
`;

const A = ({ href, children }) =>
  href ? (
    <a href={href} target="_blank" rel="noopener" className="colorInherit">
      {children}
    </a>
  ) : (
    children
  );

const getUrls = ({ type, id, changeset = '', user = '' }) => ({
  itemUrl: `https://openstreetmap.org/${type}/${id}`,
  historyUrl: `https://openstreetmap.org/${type}/${id}/history`,
  changesetUrl: changeset && `https://openstreetmap.org/changeset/${changeset}`, // prettier-ignore
  userUrl: user && `https://openstreetmap.org/user/${user}`,
});

const Urls = () => {
  const {
    feature: { osmMeta },
  } = useFeatureContext();

  const { timestamp = '2001-00-00', type, user, version = '?' } = osmMeta;
  const { itemUrl, historyUrl, changesetUrl, userUrl } = getUrls(osmMeta);
  const date = timestamp?.split('T')[0];

  return (
    <>
      <A href={itemUrl}>{capitalize(type)}</A> •{' '}
      <A href={historyUrl}>version {version}</A> •{' '}
      <A href={changesetUrl}>{date}</A> • <A href={userUrl}>{user || 'n/a'}</A>
    </>
  );
};

const FromOsm = () => (
  <Box m={1}>
    <Grid
      component="div"
      container
      direction="row"
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      <Grid item xs={3}>
        <Box mt={2}>
          <img
            src="/logo-osm.svg"
            alt="OpenStreetMap logo"
            width={50}
            height={50}
          />
        </Box>
      </Grid>
      <Grid item xs={9} md={7}>
        <Box my={1}>
          <Typography variant="body2">
            <Translation id="homepage.about_osm" />
          </Typography>
        </Box>
      </Grid>
    </Grid>
    <Urls />
  </Box>
);

export const FeatureDescription = ({ advanced, setAdvanced }) => {
  const {
    feature: { osmMeta, nonOsmObject, point },
  } = useFeatureContext();
  const { type } = osmMeta;

  const isMobile = isMobileDevice();
  const [mobileTooltipShown, toggleMobileTooltip] = useToggleState(false);

  const onClick = (e) => {
    // Alt+Shift+click to enable FeaturePanel advanced mode
    if (e.shiftKey && e.altKey) {
      setAdvanced((v) => !v);
    }
    if (isMobile) {
      toggleMobileTooltip();
    }
  };

  if (point) {
    return <div>{t('featurepanel.feature_description_point')}</div>;
  }
  if (nonOsmObject) {
    return <div>{t('featurepanel.feature_description_nonosm', { type })}</div>;
  }

  return (
    <div>
      {!advanced &&
        t('featurepanel.feature_description_osm', {
          type: capitalize(type),
        })}
      {advanced && <Urls />}

      <Tooltip
        arrow
        title={<FromOsm />}
        placement="top"
        open={isMobile ? mobileTooltipShown : undefined}
      >
        <StyledIconButton onClick={onClick}>
          {!mobileTooltipShown && (
            <InfoOutlinedIcon fontSize="small" color="secondary" />
          )}
          {mobileTooltipShown && (
            <CloseIcon fontSize="small" color="disabled" />
          )}
        </StyledIconButton>
      </Tooltip>
    </div>
  );
};
