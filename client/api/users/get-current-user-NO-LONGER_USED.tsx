import { NextPageContext } from 'next';
import configureAxios from '../configure-axios';
import { CURRENT_USER_URL } from '@orbitelco/common';

export const getCurrentUser = async (context: NextPageContext) => {
  const axiosInstance = configureAxios(context);
  const data = await axiosInstance.get(CURRENT_USER_URL);
  return data;
};
