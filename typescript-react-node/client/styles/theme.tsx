import { createContext, useState, useMemo } from 'react';
import { createTheme, Theme } from '@mui/material/styles';

// Define the color token types
type ColorToken = {
  [key: number]: string;
};

type Tokens = {
  grey: ColorToken;
  primary: ColorToken;
  greenAccent: ColorToken;
  redAccent: ColorToken;
  blueAccent: ColorToken;
};

// color design tokens export
export const tokens = (mode: 'dark' | 'light'): Tokens => ({
  ...(mode === 'dark'
    ? {
        grey: {
          50: '#ffffff',
          100: '#e0e0e0',
          200: '#c2c2c2',
          300: '#a3a3a3',
          400: '#858585',
          500: '#666666',
          600: '#525252',
          700: '#3d3d3d',
          800: '#292929',
          900: '#141414',
          950: '#000000',
        },
        primary: {
          100: '#d0d1d5',
          200: '#a1a4ab',
          300: '#727681',
          400: '#1F2A40',
          500: '#141b2d',
          600: '#101624',
          700: '#0c101b',
          800: '#080b12',
          900: '#040509',
        },
        greenAccent: {
          100: '#dbf5ee',
          200: '#b7ebde',
          300: '#94e2cd',
          400: '#70d8bd',
          500: '#4cceac',
          600: '#3da58a',
          700: '#2e7c67',
          800: '#1e5245',
          900: '#0f2922',
        },
        redAccent: {
          100: '#f8dcdb',
          200: '#f1b9b7',
          300: '#e99592',
          400: '#e2726e',
          500: '#db4f4a',
          600: '#af3f3b',
          700: '#832f2c',
          800: '#58201e',
          900: '#2c100f',
        },
        blueAccent: {
          100: '#e1e2fe',
          200: '#c3c6fd',
          300: '#a4a9fc',
          400: '#868dfb',
          500: '#6870fa',
          600: '#535ac8',
          700: '#3e4396',
          800: '#2a2d64',
          900: '#151632',
        },
      }
    : {
        grey: {
          50: '#000000',
          100: '#141414',
          200: '#292929',
          300: '#3d3d3d',
          400: '#525252',
          500: '#666666',
          600: '#858585',
          700: '#a3a3a3',
          800: '#c2c2c2',
          900: '#e0e0e0',
          950: '#ffffff',
        },
        primary: {
          50: '#e6e8f0',
          100: '#c7cde3',
          200: '#a8b2d6',
          300: '#8997c9',
          400: '#6a7cbc',
          500: '#414e71',
          600: '#3a4765',
          700: '#333f59',
          800: '#2c374d',
          900: '#252e41',
        },
        greenAccent: {
          100: '#0f2922',
          200: '#1e5245',
          300: '#2e7c67',
          400: '#3da58a',
          500: '#4cceac',
          600: '#70d8bd',
          700: '#94e2cd',
          800: '#b7ebde',
          900: '#dbf5ee',
        },
        redAccent: {
          100: '#2c100f',
          200: '#58201e',
          300: '#832f2c',
          400: '#af3f3b',
          500: '#db4f4a',
          600: '#e2726e',
          700: '#e99592',
          800: '#f1b9b7',
          900: '#f8dcdb',
        },
        blueAccent: {
          100: '#151632',
          200: '#2a2d64',
          300: '#3e4396',
          400: '#535ac8',
          500: '#6870fa',
          600: '#868dfb',
          700: '#a4a9fc',
          800: '#c3c6fd',
          900: '#e1e2fe',
        },
      }),
});

const getTheme = (mode: 'light' | 'dark') => {
  const colors = tokens(mode);
  const colorTextPrimary = colors.grey[50];
  return createTheme({
    palette: {
      mode: mode,
      ...(mode === 'dark'
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[100], // 800
            },
            secondary: {
              main: colors.greenAccent[600],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[400],
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[800],
            },
            secondary: {
              main: colors.greenAccent[400],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[50],
            },
          }),
    },
    typography: {
      fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
      fontSize: 12,
      h1: {
        fontSize: 40,
      },
      h2: {
        fontSize: 32,
      },
      h3: {
        fontSize: 24,
      },
      h4: {
        fontSize: 20,
      },
      h5: {
        fontSize: 16,
      },
      h6: {
        fontSize: 14,
      },
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? '#272727' : colors.primary[800],
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            // color: mode === 'dark' ? colors.grey[100] : colors.grey[900],
            color: colorTextPrimary,
            backgroundColor:
              mode === 'dark'
                ? colors.greenAccent[600]
                : colors.greenAccent[600],
            '&:hover': {
              backgroundColor:
                mode === 'dark'
                  ? colors.greenAccent[800]
                  : colors.greenAccent[400],
            },
            '&.Mui-disabled': {
              // color: mode === 'dark' ? colors.grey[900] : colors.grey[100],
              color: colorTextPrimary,
              backgroundColor:
                mode === 'dark' ? colors.grey[500] : colors.grey[900],
            },
          },
        },
      },
      // MuiTextField: {
      //   styleOverrides: {
      //     root: {
      //       paddingTop: '2px',
      //       paddingBottom: '2px',
      //     },
      //   },
      // },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            '&.Mui-error': {
              fontSize: '1rem',
            },
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: colorTextPrimary,
            // color: mode === 'dark' ? colors.grey[50] : colors.grey[50],
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 'bold',
          },
        },
      },
    },
  });
};

export const secondaryButtonStyles = (theme: Theme) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#e2726e' : '#e99592',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#f1b9b7' : '#f8dcdb',
  },
});

// Context for color mode
interface ColorModeContextType {
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
});

// Hook for using mode
export const useMode = (): [Theme, ColorModeContextType] => {
  const [mode, setMode] = useState<'dark' | 'light'>('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    []
  );

  const theme = useMemo(() => getTheme(mode), [mode]);
  return [theme, colorMode];
};
