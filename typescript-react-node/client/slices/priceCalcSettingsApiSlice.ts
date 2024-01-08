import {
  PRICE_CALC_SETTINGS_URL,
  IPriceCalcSettingsAttrs,
} from '@orbitelco/common';

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
