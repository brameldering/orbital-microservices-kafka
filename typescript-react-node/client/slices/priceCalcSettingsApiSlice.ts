import { PRICE_CALC_SETTINGS_URL } from 'constants/url-constants';
import { IPriceCalcSettingsAttrs } from '../types/common-types';

import apiSlice from './apiSlice';

export const priceCalcSettingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updatePriceCalcSettings: builder.mutation<
      IPriceCalcSettingsAttrs,
      IPriceCalcSettingsAttrs
    >({
      query: (data) => ({
        url: PRICE_CALC_SETTINGS_URL,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const { useUpdatePriceCalcSettingsMutation } = priceCalcSettingsApiSlice;
