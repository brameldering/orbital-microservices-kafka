/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppProps } from 'next/app';
import { HelmetProvider } from 'react-helmet-async';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import AdminSideBar from 'components/AdminSideBar';
import TopBar from 'components/TopBar';
import Footer from 'components/Footer';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';
import type { RootState } from 'slices/store';
import { ADMIN_ROLE } from '@orbitelco/common';

// Potentially add automatic logout based on expiration time
// See useEffect in frontend App.tsx

// eslint-disable-next-line no-unused-vars
const Content = ({ Component, pageProps, router }: AppProps) => {
  // const [isSidebar, setIsSidebar] = useState(true);
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const payPalOptions = {
    clientId: 'DUMMY',
  };

  return (
    <HelmetProvider>
      <ToastContainer autoClose={2500} />
      <TopBar />
      <PayPalScriptProvider deferLoading={true} options={payPalOptions}>
        <Container sx={{ mx: 2, my: 2 }}>
          {userInfo && userInfo.role === ADMIN_ROLE ? (
            <Grid container>
              <Grid item xs={12} sm={3}>
                <AdminSideBar />
              </Grid>
              <Grid item xs={12} sm={9}>
                <Component {...pageProps} />
              </Grid>
            </Grid>
          ) : (
            <Component {...pageProps} />
          )}
        </Container>
      </PayPalScriptProvider>
      <Footer />
    </HelmetProvider>
  );
};

export default Content;
