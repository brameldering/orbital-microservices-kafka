import axios from 'axios';
import https from 'https';
import { NextPageContext } from 'next';

const ConfigureAxios = ({ req }: NextPageContext) => {
  let baseURL = '';
  let headers = {};
  let httpsAgent = {};
  // Check for existence of Req which exists on the server but not on the browser
  if (req) {
    // requests to be made to https://ingress-nginx.ingress-nginx-controller-admission.svc.cluster.local
    baseURL =
      'https://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
    // pass along the headers again which includes host and cookie
    headers = req.headers;
  } else {
    // requests to be made to base url of "" (broweser will fill in current base url)
    console.log('== on the browser!');
  }
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

export default ConfigureAxios;
