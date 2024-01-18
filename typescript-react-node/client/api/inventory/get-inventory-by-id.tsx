import { NextPageContext } from 'next';
import ConfigureAxios from '../configure-axios';
import { INVENTORY_PRODUCTS_URL } from '@orbital_app/common';

export const getInventoryById = async (
  context: NextPageContext,
  id: string
) => {
  const axiosInstance = ConfigureAxios(context);
  const res = await axiosInstance.get(`${INVENTORY_PRODUCTS_URL}/${id}`);
  return res.data;
};
