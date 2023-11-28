import { NextPageContext } from 'next';
import configureAxios from './configure-axios';
import { USERS_URL } from '@orbitelco/common';

export const getUserById = async (context: NextPageContext, id: string) => {
  const axiosInstance = configureAxios(context);
  const res = await axiosInstance.get(`${USERS_URL}/${id}`);
  return res.data;
};
