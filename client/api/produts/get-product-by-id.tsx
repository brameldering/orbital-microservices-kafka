import { NextPageContext } from 'next';
import configureAxios from '../configure-axios';
import { PRODUCTS_URL } from '@orbitelco/common';

export const getProductById = async (context: NextPageContext, id: string) => {
  const axiosInstance = configureAxios(context);
  const res = await axiosInstance.get(`${PRODUCTS_URL}/${id}`);
  return res.data;
};
