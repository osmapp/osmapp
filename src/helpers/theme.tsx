import Cookies from 'js-cookie';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey, red } from '@mui/material/colors';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useMediaQuery } from '@mui/material';

const lightTheme = createTheme({
  palette: {
    divider: 'rgba(0, 0, 0, 0.04)',
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#737373',
    },
    tertiary: {
      main: '#0078a8', // links
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f6f6f6ff',
      elevation: '#ddd',
      paper: '#fafafa',
      hover: '#f2f3f2',
      searchBox: '#eb5757',
      searchInput: 'rgba(255,255,255,0.6)',
      searchInputSolid: 'rgb(249, 248, 244)',
      searchInputPanel: 'rgba(255,255,255,0.8)',
    },
    invertFilter: 'invert(0)',
    climbing: {
      primary: '#D1D1D1',
      secondary: '#202020',
      tertiary: '#666',
      tick: '#F2EFCB',

      // @TODO: following colors should be deleted in the future
      active: '#00854dff',
      inactive: '#f6f6f6',
      border: '#555555ff',
      selected: '#000000',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    divider: 'rgba(255, 255, 255, 0.04)',
    primary: {
      main: '#ffb74d',
    },
    secondary: {
      main: '#737373',
    },
    tertiary: {
      main: '#00b6ff', // links
    },
    error: {
      main: red.A400,
    },

    background: {
      default: '#303030',
      elevation: '#333333',
      paper: '#424242',
      hover: grey['700'],
      searchBox: '#963838',
      searchInput: 'rgba(0,0,0,0.5)',
      searchInputSolid: 'rgb(35, 26, 26)',
      searchInputPanel: 'rgba(0,0,0,0.7)',
    },
    invertFilter: 'invert(1)',
    climbing: {
      primary: '#000000',
      secondary: '#fff',
      tertiary: '#666',
      tick: '#5B5C50',

      // @TODO: following colors should be deleted in the future
      active: '#2fbc81ff',
      inactive: '#0a0a0aff',
      border: '#ffffffff',
      selected: '#ffffff',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'unset' } },
    },
  },
});

export type Theme = 'light' | 'dark';
export type UserTheme = 'system' | Theme;

type UserThemeContextType = {
  userTheme: UserTheme;
  setUserTheme: (choice: UserTheme) => void;
  theme: typeof lightTheme | typeof darkTheme;
  currentTheme: Theme;
};

export const UserThemeContext = createContext<UserThemeContextType>(undefined);

const useGetCurrentTheme = (userTheme: UserTheme) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return useMemo(() => {
    if (userTheme === 'system') {
      return prefersDarkMode ? 'dark' : 'light';
    }
    return userTheme;
  }, [userTheme, prefersDarkMode]);
};

export const UserThemeProvider = ({ children, userThemeCookie }) => {
  const [userTheme, setUserThemeState] = useState<UserTheme>(
    userThemeCookie ?? 'system',
  );
  const currentTheme = useGetCurrentTheme(userTheme);
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  const setUserTheme = (choice: UserTheme) => {
    setUserThemeState(choice);
    Cookies.set('userTheme', choice, { expires: 30 * 12 * 10, path: '/' });
  };

  const value: UserThemeContextType = {
    userTheme,
    setUserTheme,
    currentTheme,
    theme,
  };
  return (
    <UserThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </UserThemeContext.Provider>
  );
};

export const useUserThemeContext = () => useContext(UserThemeContext);
