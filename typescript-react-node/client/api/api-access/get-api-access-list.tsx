import { NextPageContext } from 'next';
import ConfigureAxios from '../configure-axios';
import { API_ACCESS_URL } from '@orbital_app/common';

export const getApiAccessList = async (context: NextPageContext) => {
  const axiosInstance = ConfigureAxios(context);
  const res = await axiosInstance.get(API_ACCESS_URL);
  return res.data;
};
