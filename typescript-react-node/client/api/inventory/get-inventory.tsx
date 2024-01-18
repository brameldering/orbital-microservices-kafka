import { NextPageContext } from 'next';
import ConfigureAxios from '../configure-axios';
import { INVENTORY_PRODUCTS_URL } from '@orbital_app/common';

export const getInventory = async (context: NextPageContext) => {
  const axiosInstance = ConfigureAxios(context);
  const res = await axiosInstance.get(INVENTORY_PRODUCTS_URL);
  return res.data;
};
