import { NextPageContext } from 'next';
import ConfigureAxios from '../configure-axios';
import { API_ACCESS_URL } from '@orbitelco/common';

export const getApiAccessById = async (
  context: NextPageContext,
  id: string
) => {
  const axiosInstance = ConfigureAxios(context);
  const res = await axiosInstance.get(`${API_ACCESS_URL}/${id}`);
  return res.data;
};
