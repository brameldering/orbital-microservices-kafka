import { NextPageContext } from 'next';
import ConfigureAxios from '../configure-axios';
import { PRODUCTS_URL } from '@orbital_app/common';

export const getProductById = async (context: NextPageContext, id: string) => {
  const axiosInstance = ConfigureAxios(context);
  const res = await axiosInstance.get(`${PRODUCTS_URL}/${id}`);
  return res.data;
};
