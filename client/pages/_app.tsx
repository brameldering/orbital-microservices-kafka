/* eslint-disable react/prop-types */
import React from 'react';
import { Provider } from 'react-redux';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppProps } from 'next/app';
import { HelmetProvider } from 'react-helmet-async';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Header from 'components/Header';
import Footer from 'components/Footer';
import store from 'slices/store';
import '../styles/bootstrap.custom.css';
import '../styles/index.css';

const payPalOptions = {
  clientId: 'DUMMY',
};

// Potentially add automatic logout based on expiration time
// See useEffect in frontend App.tsx

const AppComponent = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <ToastContainer autoClose={3000} />
        <Header />
        <PayPalScriptProvider deferLoading={true} options={payPalOptions}>
          <Container className='mx-2 my-2'>
            <Component {...pageProps} />
          </Container>
        </PayPalScriptProvider>
        <Footer />
      </HelmetProvider>
    </Provider>
  );
};

export default AppComponent;
