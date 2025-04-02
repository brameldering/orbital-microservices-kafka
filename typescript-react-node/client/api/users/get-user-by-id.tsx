import { NextPageContext } from 'next';
import ConfigureAxios from '../configure-axios';
import { USERS_URL } from 'constants/url-constants';

export const getUserById = async (context: NextPageContext, id: string) => {
  const axiosInstance = ConfigureAxios(context);
  const res = await axiosInstance.get(`${USERS_URL}/${id}`);
  return res.data;
};
