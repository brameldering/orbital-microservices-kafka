const axios = require('axios');
const https = require('https');

const configureAxiosForSeedData = () => {
  const baseURL = 'https://orbital.dev';

  // 'https://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
  const headers = {};
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  return axios.create({
    baseURL,
    headers,
    httpsAgent,
  });
};

const seedData = async () => {
  const axiosInstance = configureAxiosForSeedData();
  await axiosInstance.post('/api/seeddata/v2');
  console.log('Data Seeded');
};

seedData();
