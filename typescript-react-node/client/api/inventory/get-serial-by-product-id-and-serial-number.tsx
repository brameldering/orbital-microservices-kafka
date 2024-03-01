import { NextPageContext } from 'next';
import ConfigureAxios from '../configure-axios';
import { INVENTORY_SERIALS_URL } from '@orbital_app/common';

export const getSerialByProductIdAndSerialNumber = async (
  context: NextPageContext,
  productId: string,
  serialNumber: string
) => {
  const axiosInstance = ConfigureAxios(context);
  const res = await axiosInstance.get(
    `${INVENTORY_SERIALS_URL}/${productId}/${serialNumber}`
  );
  // console.log('getSerialByProductIdAndSerialNumber res', res.data);
  return res.data;
};
