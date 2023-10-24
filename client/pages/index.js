import React from 'react';
import https from 'https';
import axios from 'axios';

const LandingPage = ({ currentUser = {} }) => {
  // extends React.Component
  console.log('currentUser', currentUser);

  return <h1>Landing Page</h1>;
};

// getInitialProps is executed on the server before the LandingPage component is send back
// however when navigating from one page to another while in the app then getInitialProps is executed on the client
LandingPage.getInitialProps = async ({ req }) => {
  let domain = '';
  const options = {};
  // Check for existence of Req which exists on the server but not on the browser
  if (req) {
    console.log('getInitialProps on the server');
    // requests to be made to https://ingress-nginx.ingress-nginx-controller-admission.svc.cluster.local
    domain = 'https://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
    // pass along the headers again which includes host and cookie
    options.headers = req.headers;
  } else {
    // requests to be made to base url of "" (broweser will fill in current base url)
    console.log('getInitialProps on the browser');
  }
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    // dev or test
    options.httpsAgent = new https.Agent({ rejectUnauthorized: false });
  } else {
    // production
    options.httpsAgent = new https.Agent({ rejectUnauthorized: true });
  }
  const { data } = await axios.get(domain + '/api/users/currentuser', options);
  return data;
};

export default LandingPage;
