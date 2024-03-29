import { createContext, useState, useMemo } from 'react';
import { createTheme, Theme, Components } from '@mui/material/styles';

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

// Define the theme settings return type
interface ThemeSettings {
  palette: {
    mode: 'dark' | 'light';
    primary: { main: string };
    secondary: { main: string };
    neutral: { dark: string; main: string; light: string };
    background: { default: string };
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    color: string;
    h1: { fontFamily: string; fontSize: number; color: string };
    h2: { fontFamily: string; fontSize: number; color: string };
    h3: { fontFamily: string; fontSize: number; color: string };
    h4: { fontFamily: string; fontSize: number; color: string };
    h5: { fontFamily: string; fontSize: number; color: string };
    h6: { fontFamily: string; fontSize: number; color: string };
    body1: { color: string };
  };
  components?: Components;
}

// mui theme settings
export const themeSettings = (mode: 'dark' | 'light'): ThemeSettings => {
  const colors = tokens(mode);
  // const textPrimary = mode === 'dark' ? '#ffffff' : '#000000'; // White for dark mode, Black for light mode
  const colorTextPrimary = colors.grey[50];
  const colorBorder = colors.grey[300];
  const colorBorderHover = colors.grey[100];
  const colorBorderFocused = colors.grey[50];

  return {
    palette: {
      mode: mode,
      ...(mode === 'dark'
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[100], // grey[900], //'#fcfcfc',
            },
          }),
    },
    typography: {
      fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
      fontSize: 12,
      color: colorTextPrimary,
      h1: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 40,
        color: colorTextPrimary,
      },
      h2: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 32,
        color: colorTextPrimary,
      },
      h3: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 24,
        color: colorTextPrimary,
      },
      h4: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 20,
        color: colorTextPrimary,
      },
      h5: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 16,
        color: colorTextPrimary,
      },
      h6: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 14,
        color: colorTextPrimary,
      },
      body1: {
        color: colorTextPrimary,
      },
    },
    components: {
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
      MuiTextField: {
        styleOverrides: {
          root: {
            paddingTop: '2px',
            paddingBottom: '2px',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          shrink: {
            color: colorTextPrimary,
            transform: 'translate(14px, -8px) scale(0.75)',
            fontSize: '1.2rem',
            maxWidth: '60%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            // Normal state
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: colorBorder,
            },
            // Hover state
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colorBorderHover,
            },
            // Focused state
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colorBorderFocused,
            },
          },
          notchedOutline: {
            '& legend': {
              width: '100px',
            },
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            '&.Mui-error': {
              fontSize: '1rem',
            },
          },
        },
      },
      // Custom style for table header cells
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: mode === 'dark' ? '#0a0d16' : colors.grey[800],
            color: colorTextPrimary,
            fontWeight: 'bold',
          },
        },
      },
      // Custom style for Links
      MuiLink: {
        styleOverrides: {
          root: {
            color:
              mode === 'dark' ? colors.blueAccent[200] : colors.primary[500],
          },
        },
      },
    },
  };
};

// export const getSecondaryButtonStyles = (theme) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? theme.palette.blueAccent[400] : theme.palette.blueAccent[200],
//   '&:hover': {
//     backgroundColor: theme.palette.mode === 'dark' ? theme.palette.blueAccent[600] : theme.palette.blueAccent[300],
//   },
// });
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
  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
