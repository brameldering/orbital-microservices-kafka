import React from 'react';
import { ICurrentUser } from '@orbitelco/common';
import { NextPageContext } from 'next';
import { getCurrentUser } from '../api/get-current-user';

interface TPageProps {
  currentUser?: ICurrentUser;
}

const LandingPage: React.FC<TPageProps> = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const { data } = await getCurrentUser(context);
  // console.log(
  //   'index.tsx getServerSideProps {data}.currentUser',
  //   data.currentUser
  // );
  return { props: data };
};

export default LandingPage;
