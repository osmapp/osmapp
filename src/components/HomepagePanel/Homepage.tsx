import { Button, Grid, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GetAppIcon from '@mui/icons-material/GetApp';
import React from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import {
  PanelContent,
  PanelFooterWrapper,
  PanelScrollbars,
} from '../utils/PanelHelpers';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { LogoOpenClimbing } from '../../assets/LogoOpenClimbing';
import {
  PROJECT_DECRIPTION,
  PROJECT_ID,
  PROJECT_NAME,
} from '../../services/project';
import { intl, t, Translation } from '../../services/intl';
import { nl2br } from '../utils/nl2br';
import GithubIcon from '../../assets/GithubIcon';
import { SEARCH_BOX_HEIGHT } from '../SearchBox/consts';
import LogoOsmapp from '../../assets/LogoOsmapp';
import { LogoMaptiler } from '../../assets/LogoMaptiler';

export const Content = styled.div`
  height: calc(100% - ${SEARCH_BOX_HEIGHT}px);
  padding: 20px 2em 0 2em;
`;
const StyledLogoOsmapp = styled(LogoOsmapp)`
  width: 41%;
  height: auto;
  margin-top: 3em;
`;
const Center = styled.div<{ $mb?: boolean; $mb4?: boolean; $mt?: boolean }>`
  text-align: center;
  ${({ $mb }) => $mb && 'margin-bottom: 2em;'}
  ${({ $mb4 }) => $mb4 && 'margin-bottom: 4em;'}
  ${({ $mt }) => $mt && 'margin-top: 2em;'}
`;
const Spacer = styled.div`
  padding-bottom: 2em;
`;
const Examples = () => (
  <>
    {t('homepage.examples.eg')}{' '}
    <Link href="/way/34633854" locale={intl.lang}>
      Empire State Building
    </Link>{' '}
    •{' '}
    <Link href="/way/119016167" locale={intl.lang}>
      {t('homepage.examples.charles_bridge_statues')}
    </Link>
  </>
);
const ExamplesClimbing = () => (
  <>
    <Link href="/climbing-areas" locale={intl.lang}>
      {t('climbingareas.link')}
    </Link>
    , {t('homepage.examples.eg')}{' '}
    <Link href="/relation/17262675" locale={intl.lang}>
      Hlubočepy
    </Link>{' '}
    •{' '}
    <Link href="/relation/17130099" locale={intl.lang}>
      Roviště
    </Link>{' '}
    •{' '}
    <Link href="/relation/17142287" locale={intl.lang}>
      Lomy nad Velkou
    </Link>{' '}
    •{' '}
    <Link href="/relation/17400318" locale={intl.lang}>
      Lom Kobyla
    </Link>{' '}
    •{' '}
    <Link href="/relation/17222859" locale={intl.lang}>
      Prokopák
    </Link>
  </>
);

export function Homepage({
  mobileMode,
  onClick,
}: {
  onClick: () => void;
  mobileMode: boolean;
}) {
  const isClimbing = PROJECT_ID === 'openclimbing';

  return (
    <PanelContent>
      <PanelScrollbars>
        <ClosePanelButton right onClick={onClick} />
        <Content>
          <div>
            <Center $mb>
              {isClimbing ? (
                <LogoOpenClimbing
                  width={100}
                  style={{
                    marginTop: 24,
                    marginBottom: 16,
                  }}
                />
              ) : (
                <StyledLogoOsmapp width={130} height={130} />
              )}
              <Typography
                variant="h4"
                component="h1"
                color="inherit"
                style={{ fontWeight: isClimbing ? 900 : undefined }}
              >
                {PROJECT_NAME}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {t(PROJECT_DECRIPTION)}
              </Typography>
            </Center>
            <Typography variant="body1" paragraph>
              {nl2br(t('homepage.how_to_start'))}
            </Typography>
            <Typography variant="body2" paragraph>
              {isClimbing ? <ExamplesClimbing /> : <Examples />}
            </Typography>
            {mobileMode && (
              <Center $mt $mb4>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  onClick={onClick}
                >
                  {t('homepage.go_to_map_button')}
                </Button>
              </Center>
            )}
            <Center $mb>
              <img
                src={
                  isClimbing
                    ? '/openclimbing/openclimbing-screenshot-300px.png'
                    : '/osmapp/osmapp-screenshot-300px.png'
                }
                srcSet={
                  isClimbing
                    ? '/openclimbing/openclimbing-screenshot-300px@2x.png 2x'
                    : '/osmapp/osmapp-screenshot-300px@2x.png 2x'
                }
                alt={t('homepage.screenshot_alt')}
                width={300}
              />
            </Center>
            <Spacer />
            <Grid
              container
              direction="row"
              alignItems="flex-start"
              justifyContent="flex-start"
            >
              <Grid item xs={4}>
                <img
                  src="/logo-osm.svg"
                  alt="OpenStreetMap logo"
                  width={100}
                  height={100}
                />
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" paragraph>
                  <Translation id="homepage.about_osm" />
                </Typography>
              </Grid>
            </Grid>
            <Spacer />
            <Typography
              variant="overline"
              display="block"
              color="textSecondary"
              component="h2"
            >
              {t('homepage.heading_about_osmapp')}
            </Typography>
            <Typography variant="body2" paragraph>
              <Translation id="homepage.about_osmapp" />
            </Typography>
            <Typography variant="body2" paragraph>
              <GithubIcon
                width="32"
                height="32"
                style={{ verticalAlign: '-9px', margin: '0 10px 0 5px' }}
              />{' '}
              <Translation id="homepage.github_link" />
            </Typography>
            <Center $mb $mt>
              <Button
                variant="outlined"
                startIcon={<GetAppIcon />}
                color="primary"
                href="/install"
              >
                {t('install.button')}
              </Button>
            </Center>
            <Spacer />
            <Typography variant="overline" color="textSecondary" component="h2">
              {t('homepage.special_thanks_heading')}
            </Typography>
            <ul style={{ paddingLeft: '1.6em' }}>
              <li>
                <a href="https://www.mapillary.com/" target="_blank">
                  Mapillary
                </a>
                {', '}
                <a href="https://openstreetmap.cz/fody" target="_blank">
                  Fody
                </a>
                {', '}
                <a href="https://www.wikipedia.org/" target="_blank">
                  Wikipedia
                </a>
                {` – ${t('homepage.for_images')}`}
              </li>
              <li>
                <a href="https://www.openstreetmap.org/" target="_blank">
                  OpenStreetMap
                </a>
                {` – ${t('homepage.for_osm')}`}
              </li>
              <li>
                <a href="https://www.maptiler.com" target="_blank">
                  Maptiler
                </a>
                {` – ${t('homepage.maptiler')}`}
              </li>
              <li>
                <a
                  href="https://vercel.com/?utm_source=osm-app-team&utm_campaign=oss"
                  target="_blank"
                >
                  Vercel
                </a>
                {` – ${t('homepage.vercel')}`}
              </li>
            </ul>
            <a href="https://www.maptiler.com" target="_blank">
              <LogoMaptiler width={200} height={52} />
            </a>
            <br />
            <a
              href="https://vercel.com/?utm_source=osm-app-team&utm_campaign=oss"
              target="_blank"
            >
              <img src="/vercel.svg" alt="Vercel" width="200" height="41" />
            </a>

            <Spacer />
            <Spacer />
            <Typography variant="overline" color="textSecondary" component="h2">
              {t('homepage.disclaimer_heading')}
            </Typography>
            <Translation id="homepage.disclaimer" />
            <br />
            <br />
            <Translation id="homepage.disclaimer_maptiler" />
            <Spacer />
          </div>
          <PanelFooterWrapper />
        </Content>
      </PanelScrollbars>
    </PanelContent>
  );
}
