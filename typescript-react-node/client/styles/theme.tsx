import { createContext, useState, useMemo } from 'react';
import { createTheme, Theme } from '@mui/material/styles';

const getTheme = (mode: 'light' | 'dark') => {
  return createTheme({
    palette: {
      mode: mode,
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
