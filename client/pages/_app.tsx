/* eslint-disable react/prop-types */
import React from 'react';
import { NextPageContext } from 'next';
import { AppProps } from 'next/app';
import buildClient from 'api/build-client';
import Header from 'components/Header';
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
  console.log('currentUser', currentUser);
  return (
    <>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />;
    </>
  );
};

// AppComponent.getInitialProps = async (appContext: AppContext) => {
//   console.log('AppComponent.getInitialProps');
//   const client = buildClient(appContext.ctx);
//   const { data } = await client.get('/api/users/v2/currentuser');
//   console.log('currentuser data', data);
//   return data;
// };

AppComponent.getServerSideProps = async (context: NextPageContext) => {
  console.log('========================');
  console.log('AppComponent.getServerSideProps');
  const client = buildClient(context);
  const { data } = await client.get('/api/users/v2/currentuser');
  console.log('currentuser data', data);
  return data;
};

export default AppComponent;
