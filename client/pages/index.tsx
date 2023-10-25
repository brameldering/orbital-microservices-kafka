import React from 'react';
import { NextPageContext } from 'next';
import buildClient from '../api/build-client';

interface TLandingPageProps {
  currentUser?: { email: string };
}

const LandingPage: React.FC<TLandingPageProps> = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in as {currentUser.email}</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

// getInitialProps is executed on the server before the LandingPage component is send back.
// However when navigating from one page to another while in the app then getInitialProps is executed on the client
export const getServerSideProps = async (context: NextPageContext) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return { props: data };
};

// export const getStaticProps = async (context: NextPageContext) => {
// };

export default LandingPage;