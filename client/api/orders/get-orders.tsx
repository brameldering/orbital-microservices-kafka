import { NextPageContext } from 'next';
import configureAxios from '../configure-axios';
import { ORDERS_URL } from '@orbitelco/common';

export const getOrders = async (context: NextPageContext) => {
  const axiosInstance = configureAxios(context);
  const res = await axiosInstance.get(ORDERS_URL);
  return res.data;
};
