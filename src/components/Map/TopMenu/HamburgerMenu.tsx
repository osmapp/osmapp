import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import React, { useEffect, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import HelpIcon from '@mui/icons-material/Help';
import styled from '@emotion/styled';
import GetAppIcon from '@mui/icons-material/GetApp';
import Router from 'next/router';
import { useBoolState } from '../../helpers';
import { t } from '../../../services/intl';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useMapStateContext } from '../../utils/MapStateContext';
import { getIdEditorLink } from '../../FeaturePanel/helpers/externalLinks';
import { UserTheme, useUserThemeContext } from '../../../helpers/theme';
import GithubIcon from '../../../assets/GithubIcon';
import { LangSwitcher } from './LangSwitcher';
import { HamburgerIconButton } from './HamburgerIconButton';
import { PROJECT_ID } from '../../../services/project';

const StyledGithubIcon = styled(GithubIcon)`
  filter: ${({ theme }) => theme.palette.invertFilter};
  margin: -2px 8px 0 0;
`;

const PencilIcon = styled(CreateIcon)`
  color: ${({ theme }) => theme.palette.action.active};
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

const HomeIcon = styled(HelpIcon)`
  color: ${({ theme }) => theme.palette.action.active};
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

const InstallIcon = styled(GetAppIcon)`
  color: ${({ theme }) => theme.palette.action.active};
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

const StyledBrightnessAutoIcon = styled(BrightnessAutoIcon)`
  color: ${({ theme }) => theme.palette.action.active};
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

const StyledBrightness4Icon = styled(Brightness4Icon)`
  color: ${({ theme }) => theme.palette.action.active};
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

const StyledBrightnessHighIcon = styled(BrightnessHighIcon)`
  color: ${({ theme }) => theme.palette.action.active};
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

const StyledDivider = styled.hr`
  border-top: 1px solid ${({ theme }) => theme.palette.divider};
`;

const useIsBrowser = () => {
  // fixes hydration error - server and browser have different view (cookies and window.hash)
  // throwed "Warning: Prop `href` did not match."
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(true);
  }, []);
  return browser;
};

const EditLink = ({ closeMenu }) => {
  const browser = useIsBrowser();
  const { view } = useMapStateContext();
  const { feature } = useFeatureContext();
  const href = getIdEditorLink(feature, browser ? view : undefined);
  return (
    <MenuItem component="a" href={href} target="_blank" onClick={closeMenu}>
      <PencilIcon />
      {t('map.edit_link')}
    </MenuItem>
  );
};

const AboutLink = ({ closeMenu }) => {
  const { persistShowHomepage, homepageShown } = useFeatureContext();
  const handleClick = () => {
    persistShowHomepage();
    closeMenu();
  };
  return (
    <MenuItem
      disabled={homepageShown}
      onClick={handleClick}
      title={process.env.sentryRelease}
    >
      <HomeIcon />
      {t('map.about_link')}
    </MenuItem>
  );
};
const GithubLink = ({ closeMenu }) => (
  <MenuItem
    href="https://github.com/zbycz/osmapp"
    component="a"
    target="_blank"
    onClick={closeMenu}
  >
    <StyledGithubIcon width={14} height={14} />
    {t('map.github_title')}
  </MenuItem>
);
const ClimbingAreasLink = ({ closeMenu }) => (
  <MenuItem href="/climbing-areas" component="a" onClick={closeMenu}>
    {t('climbingareas.title')}
  </MenuItem>
);

const InstallLink = ({ closeMenu }) => {
  const handleClick = () => {
    closeMenu();
    Router.push('/install');
  };
  return (
    <MenuItem onClick={handleClick} href="/install">
      <InstallIcon />
      {t('install.button')}
    </MenuItem>
  );
};

const themeOptions = {
  system: {
    icon: StyledBrightnessAutoIcon,
    label: t('darkmode_auto'),
    next: 'dark' as UserTheme,
  },
  dark: {
    icon: StyledBrightness4Icon,
    label: t('darkmode_on'),
    next: 'light' as UserTheme,
  },
  light: {
    icon: StyledBrightnessHighIcon,
    label: t('darkmode_off'),
    next: 'system' as UserTheme,
  },
};

const ThemeSelection = () => {
  const { userTheme, setUserTheme } = useUserThemeContext();
  const option = themeOptions[userTheme];
  const handleClick = () => {
    setUserTheme(option.next);
  };

  return (
    <MenuItem onClick={handleClick}>
      <option.icon /> {option.label}
    </MenuItem>
  );
};

// TODO custom Item components are not keyboard accesible
// seems like a bug in material-ui
// https://github.com/mui-org/material-ui/issues/22912
// https://github.com/mui-org/material-ui/issues?q=is%3Aissue+is%3Aopen+menuitem+keyboard

export const HamburgerMenu = () => {
  const anchorRef = React.useRef();
  const [opened, open, close] = useBoolState(false);
  const isOpenClimbing = PROJECT_ID === 'openclimbing';

  return (
    <>
      <Menu
        id="hamburger-menu"
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={opened}
        onClose={close}
      >
        <ThemeSelection />
        <EditLink closeMenu={close} />
        <StyledDivider />
        <InstallLink closeMenu={close} />
        <AboutLink closeMenu={close} />
        <GithubLink closeMenu={close} />
        {isOpenClimbing && <ClimbingAreasLink closeMenu={close} />}
        <StyledDivider />
        <LangSwitcher />
      </Menu>
      <HamburgerIconButton anchorRef={anchorRef} onClick={open} />
    </>
  );
};
