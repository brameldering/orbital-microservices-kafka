/* eslint-disable react/prop-types */
import React from 'react';
import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import store from 'slices/store';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from '../styles/theme';
import Content from 'components/Content';

import '../styles/index.css'; // To Do incorporate in custom theme
// import '../styles/bootstrap.custom.css';

// Potentially add automatic logout based on expiration time
// See useEffect in frontend App.tsx

const AppComponent = ({ Component, pageProps, router }: AppProps) => {
  const [theme, colorMode] = useMode();

  const payPalOptions = {
    clientId: 'DUMMY',
  };

  return (
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true} options={payPalOptions}>
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
      </PayPalScriptProvider>
    </Provider>
  );
};

export default AppComponent;
