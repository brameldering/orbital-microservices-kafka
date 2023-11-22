/* eslint-disable react/prop-types */
import React from 'react';
import { Container } from 'react-bootstrap';
// import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NextPageContext } from 'next';
import { AppProps } from 'next/app';
import { HelmetProvider } from 'react-helmet-async';
import configureAxios from 'api/configure-axios';
import Header from 'components/Header';
import Footer from 'components/Footer';
// import store from '../store';
import { UserProvider } from 'context/user-context';
import { CURRENT_USER_URL, IUser } from '@orbitelco/common';
import '../styles/bootstrap.custom.css';
import '../styles/index.css';

const AppComponent = ({ Component, pageProps }: AppProps) => {
  let currentUser: IUser = pageProps?.currentUser || undefined;

  if (pageProps?.currentUser) {
    console.log('_app.tsx currentuser', pageProps.currentUser.name);
    currentUser = pageProps.currentUser;
    console.log('_app.tsx currentuser destructured', currentUser.email);
  }
  return (
    // <Provider store={store}>
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
    // </Provider>
  );
};

AppComponent.getServerSideProps = async (context: NextPageContext) => {
  console.log('AppComponent.getServerSideProps');
  const client = configureAxios(context);
  const { data } = await client.get(CURRENT_USER_URL);
  return data;
};

export default AppComponent;
