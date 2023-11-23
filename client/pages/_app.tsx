/* eslint-disable react/prop-types */
import React from 'react';
import { Provider } from 'react-redux';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppProps } from 'next/app';
import { HelmetProvider } from 'react-helmet-async';
import Header from 'components/Header';
import Footer from 'components/Footer';
import store from '../slices/store';
import '../styles/bootstrap.custom.css';
import '../styles/index.css';

const AppComponent = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <ToastContainer autoClose={3000} />
        <Header />
        <Container className='mx-2 my-2'>
          <Component {...pageProps} />
        </Container>
        <Footer />
      </HelmetProvider>
    </Provider>
  );
};

export default AppComponent;
