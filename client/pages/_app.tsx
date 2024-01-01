/* eslint-disable react/prop-types */
import React from 'react';
import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import store from 'slices/store';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from '../theme';
import Content from 'components/Content';

import '../styles/index.css'; // To Do incorporate in custom theme
// import '../styles/bootstrap.custom.css';

// Potentially add automatic logout based on expiration time
// See useEffect in frontend App.tsx

const AppComponent = ({ Component, pageProps, router }: AppProps) => {
  const [theme, colorMode] = useMode();

  return (
    <Provider store={store}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Content
            Component={Component}
            pageProps={pageProps}
            router={router}
          />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Provider>
  );
};

export default AppComponent;
