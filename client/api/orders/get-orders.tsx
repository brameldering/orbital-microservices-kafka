import { NextPageContext } from 'next';
import ConfigureAxios from '../configure-axios';
import { ORDERS_URL } from '@orbitelco/common';

export const getOrders = async (context: NextPageContext) => {
  const axiosInstance = ConfigureAxios(context);
  const res = await axiosInstance.get(ORDERS_URL);
  return res.data;
};
