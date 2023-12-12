import { NextPageContext } from 'next';
import configureAxios from '../configure-axios';
import { PRICE_CALC_SETTINGS_URL } from '@orbitelco/common';

export const getPriceCalcSettings = async (context: NextPageContext) => {
  const axiosInstance = configureAxios(context);
  const res = await axiosInstance.get(PRICE_CALC_SETTINGS_URL);
  return res.data;
};
