import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { IFeesConfig } from '../types/configTypes';

const configInfoLocalStorage: string | null =
  localStorage.getItem('configInfo');

const initialState: IFeesConfig = configInfoLocalStorage
  ? JSON.parse(configInfoLocalStorage)
  : { VATPercentage: 0, ShippingFee: 0 };

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<IFeesConfig>) => {
      state.VATPercentage = action.payload.VATPercentage;
      state.ShippingFee = action.payload.ShippingFee;
      state.ThresholdFreeShipping = action.payload.ThresholdFreeShipping;

      localStorage.setItem('configInfo', JSON.stringify(state));
    },
  },
});

export const { setConfig } = configSlice.actions;

export default configSlice.reducer;
