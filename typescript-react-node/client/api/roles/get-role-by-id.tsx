import { NextPageContext } from 'next';
import ConfigureAxios from '../configure-axios';
import { ROLES_URL } from '@orbital_app/common';

export const getRoleById = async (context: NextPageContext, id: string) => {
  const axiosInstance = ConfigureAxios(context);
  const res = await axiosInstance.get(`${ROLES_URL}/${id}`);
  return res.data;
};
