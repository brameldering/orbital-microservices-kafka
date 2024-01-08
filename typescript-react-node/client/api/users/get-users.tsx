import { NextPageContext } from 'next';
import ConfigureAxios from '../configure-axios';
import { USERS_URL } from '@orbitelco/common';

export const getUsers = async (context: NextPageContext) => {
  const axiosInstance = ConfigureAxios(context);
  const res = await axiosInstance.get(USERS_URL);
  return res.data;
};
