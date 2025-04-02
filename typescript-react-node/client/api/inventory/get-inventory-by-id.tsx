import { NextPageContext } from 'next';
import ConfigureAxios from '../configure-axios';
import { PRODUCT_INVENTORY_URL } from 'constants/url-constants';

export const getInventoryById = async (
  context: NextPageContext,
  id: string
) => {
  const axiosInstance = ConfigureAxios(context);
  const res = await axiosInstance.get(`${PRODUCT_INVENTORY_URL}/${id}`);
  return res.data;
};
