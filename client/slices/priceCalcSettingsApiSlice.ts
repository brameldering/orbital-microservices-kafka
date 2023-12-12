import {
  PRICE_CALC_SETTINGS_URL,
  IPriceCalcSettingsObj,
} from '@orbitelco/common';

import apiSlice from './apiSlice';

export const priceCalcSettingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updatePriceCalcSettings: builder.mutation<
      IPriceCalcSettingsObj,
      IPriceCalcSettingsObj
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
