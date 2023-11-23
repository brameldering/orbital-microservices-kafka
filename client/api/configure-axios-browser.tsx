import axios from 'axios';
import https from 'https';

export default () => {
  const baseURL = '';
  const headers = {};
  let httpsAgent = {};
  // Set SSL Certifcate check to false for dev and test and true otherwise
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    // dev or test
    httpsAgent = new https.Agent({ rejectUnauthorized: false });
  } else {
    // production
    httpsAgent = new https.Agent({ rejectUnauthorized: true });
  }
  return axios.create({
    baseURL,
    headers,
    httpsAgent,
  });
};
