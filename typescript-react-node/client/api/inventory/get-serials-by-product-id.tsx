import { NextPageContext } from 'next';
import ConfigureAxios from '../configure-axios';
import { INVENTORY_SERIALS_URL } from '@orbital_app/common';

export const getSerialsByProductId = async (
  context: NextPageContext,
  id: string
) => {
  const axiosInstance = ConfigureAxios(context);
  const res = await axiosInstance.get(`${INVENTORY_SERIALS_URL}/${id}`);
  console.log('getSerialByProductId res', res.data);
  return res.data;
};
