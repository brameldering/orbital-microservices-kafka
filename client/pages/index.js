import React from 'react';
import buildClient from '../api/build-client';

const LandingPage = ({ currentUser = {} }) => {
  // extends React.Component

  return currentUser ? (
    <h1>You are signed in as {currentUser.email}</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

// getInitialProps is executed on the server before the LandingPage component is send back
// however when navigating from one page to another while in the app then getInitialProps is executed on the client
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
};

export default LandingPage;
