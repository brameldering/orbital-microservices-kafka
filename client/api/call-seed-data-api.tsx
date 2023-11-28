import { NextPageContext } from 'next';
import configureAxios from './configure-axios';
import { SEED_DATA_URL } from '@orbitelco/common';

export const seedData = async (context: NextPageContext) => {
  const axiosInstance = configureAxios(context);
  await axiosInstance.post(SEED_DATA_URL);
};
