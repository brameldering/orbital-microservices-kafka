import { NextPageContext } from 'next';
import ConfigureAxios from '../configure-axios';
import { PRODUCT_INVENTORY_URL } from '@orbital_app/common';

export const getInventory = async (context: NextPageContext) => {
  const axiosInstance = ConfigureAxios(context);
  const res = await axiosInstance.get(PRODUCT_INVENTORY_URL);
  return res.data;
};
