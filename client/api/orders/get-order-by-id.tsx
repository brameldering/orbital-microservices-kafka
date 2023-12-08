import { NextPageContext } from 'next';
import configureAxios from '../configure-axios';
import { ORDERS_URL } from '@orbitelco/common';

export const getOrderById = async (context: NextPageContext, id: string) => {
  const axiosInstance = configureAxios(context);
  const res = await axiosInstance.get(`${ORDERS_URL}/${id}`);
  return res.data;
};
