/* eslint-disable react/prop-types */
import React from 'react';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NextPageContext } from 'next';
import { AppProps } from 'next/app';
import { HelmetProvider } from 'react-helmet-async';
import configureAxios from 'api/configure-axios';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { UserProvider } from 'context/user-context';
import { CURRENT_USER_URL, IUser } from '@orbitelco/common';
import '../styles/bootstrap.custom.css';
import '../styles/index.css';

const AppComponent = ({ Component, pageProps }: AppProps) => {
  const currentUser: IUser = pageProps?.currentUser ?? undefined;
  return (
    <UserProvider>
      <HelmetProvider>
        <ToastContainer autoClose={3000} />
        <Header currentUser={currentUser} />
        <Container className='mx-2 my-2'>
          <Component {...pageProps} />
        </Container>
        <Footer />
      </HelmetProvider>
    </UserProvider>
  );
};

AppComponent.getServerSideProps = async (context: NextPageContext) => {
  const client = configureAxios(context);
  const { data } = await client.get(CURRENT_USER_URL);
  return data;
};

export default AppComponent;
