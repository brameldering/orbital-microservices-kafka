import { NextPageContext } from 'next';
import ConfigureAxios from '../configure-axios';
import { ORDERS_URL } from 'constants/url-constants';

export const getOrderById = async (context: NextPageContext, id: string) => {
  const axiosInstance = ConfigureAxios(context);
  const res = await axiosInstance.get(`${ORDERS_URL}/${id}`);
  return res.data;
};
