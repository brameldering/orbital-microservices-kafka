import { NextPageContext } from 'next';
import ConfigureAxios from '../configure-axios';
import { ROLES_URL } from '@orbital_app/common';

export const getRoles = async (context: NextPageContext) => {
  const axiosInstance = ConfigureAxios(context);
  const res = await axiosInstance.get(ROLES_URL);
  return res.data;
};
