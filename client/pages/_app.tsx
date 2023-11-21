/* eslint-disable react/prop-types */
import React from 'react';
import { Container } from 'react-bootstrap';
import { Provider } from 'react-redux';
import { NextPageContext } from 'next';
import { AppProps } from 'next/app';
import { HelmetProvider } from 'react-helmet-async';
import configureAxios from 'api/configure-axios';
import Header from 'components/Header';
import Footer from 'components/Footer';
import store from '../store';
import { CURRENT_USER_URL } from '@orbitelco/common';
import '../styles/bootstrap.custom.css';
import '../styles/index.css';

interface IUser {
  name: string;
  email: string;
}

const AppComponent = ({ Component, pageProps }: AppProps) => {
  let currentUser: IUser = pageProps?.currentUser || {
    name: '',
    email: '',
  };
  if (pageProps?.currentUser) {
    console.log('_app.tsx currentuser', pageProps.currentUser.name);
    currentUser = pageProps.currentUser;
    console.log('_app.tsx currentuser destructured', currentUser.email);
  }
  return (
    <Provider store={store}>
      <HelmetProvider>
        <Header currentUser={currentUser} />
        <Container className='mx-2 my-2'>
          <Component {...pageProps} />
        </Container>
        <Footer />
      </HelmetProvider>
    </Provider>
  );
};

AppComponent.getServerSideProps = async (context: NextPageContext) => {
  console.log('AppComponent.getServerSideProps');
  const client = configureAxios(context);
  const { data } = await client.get(CURRENT_USER_URL);
  return data;
};

export default AppComponent;
