/* eslint-disable react/prop-types */
import React from 'react';
import { Provider } from 'react-redux';
import { NextPageContext } from 'next';
import { AppProps } from 'next/app';
import buildClient from 'api/build-client';
import Header from 'components/Header';
import store from '../store';
import { CURRENT_USER_URL } from '@orbitelco/common';
import '../styles/bootstrap.custom.css';

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
    currentUser = pageProps.currentUser;
  }
  return (
    <Provider store={store}>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />;
    </Provider>
  );
};

AppComponent.getServerSideProps = async (context: NextPageContext) => {
  console.log('AppComponent.getServerSideProps');
  const client = buildClient(context);
  const { data } = await client.get(CURRENT_USER_URL);
  return data;
};

export default AppComponent;
