import { NextPageContext } from 'next';
import ConfigureAxios from '../configure-axios';
import { PRICE_CALC_SETTINGS_URL } from '@orbital_app/common';

export const getPriceCalcSettings = async (context: NextPageContext) => {
  const axiosInstance = ConfigureAxios(context);
  const res = await axiosInstance.get(PRICE_CALC_SETTINGS_URL);
  return res.data;
};
