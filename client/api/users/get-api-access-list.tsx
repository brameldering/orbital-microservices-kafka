import { NextPageContext } from 'next';
import configureAxios from '../configure-axios';
import { API_ACCESS_URL } from '@orbitelco/common';

export const getApiAccessList = async (context: NextPageContext) => {
  const axiosInstance = configureAxios(context);
  const res = await axiosInstance.get(API_ACCESS_URL);
  return res.data;
};
