import { NextPageContext } from 'next';
import configureAxios from '../configure-axios';
import { ROLES_URL } from '@orbitelco/common';

export const getRoles = async (context: NextPageContext) => {
  const axiosInstance = configureAxios(context);
  const res = await axiosInstance.get(ROLES_URL);
  return res.data;
};
