/* eslint-disable react/prop-types */
import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppProps } from 'next/app';
import { HelmetProvider } from 'react-helmet-async';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import AdminSideBar from 'components/AdminSideBar';
import TopBar from 'components/TopBar';
import Footer from 'components/Footer';
import store from 'slices/store';
import Grid from '@mui/material/Grid';
import { CssBaseline, ThemeProvider, Container } from '@mui/material';
import { ColorModeContext, useMode } from '../theme';
import '../styles/index.css'; // To Do incorporate in custom theme
// import '../styles/bootstrap.custom.css';

const payPalOptions = {
  clientId: 'DUMMY',
};

// Potentially add automatic logout based on expiration time
// See useEffect in frontend App.tsx

const AppComponent = ({ Component, pageProps }: AppProps) => {
  const [theme, colorMode] = useMode();
  // const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <HelmetProvider>
            <ToastContainer autoClose={2500} />
            <TopBar />
            <PayPalScriptProvider deferLoading={true} options={payPalOptions}>
              <Container sx={{ mx: 2, my: 2 }}>
                <Grid container>
                  {/* <Grid item xs={12} md={3}>
                    <AdminSideBar />
                  </Grid>
                  <Grid item xs={12} md={9}> */}
                  <Component {...pageProps} />
                  {/*  </Grid> */}
                </Grid>
              </Container>
            </PayPalScriptProvider>
            <Footer />
          </HelmetProvider>
        </Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AppComponent;
