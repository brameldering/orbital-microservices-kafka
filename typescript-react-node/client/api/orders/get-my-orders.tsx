import { NextPageContext } from 'next';
import ConfigureAxios from '../configure-axios';
import { MY_ORDERS_URL } from '@orbital_app/common';

export const getMyOrders = async (context: NextPageContext) => {
  const axiosInstance = ConfigureAxios(context);
  const res = await axiosInstance.get(MY_ORDERS_URL);
  return res.data;
};
