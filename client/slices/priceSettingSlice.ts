import { Dispatch, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IPriceCalcSettingsAttrs,
  PRICE_CALC_SETTINGS_URL,
} from '@orbitelco/common';

// Action creator that fetches information from the API
export const fetchPriceCalcSettingsInformation =
  () => async (dispatch: Dispatch) => {
    dispatch(fetchPriceCalcSettingsStart()); // Dispatch an action indicating the start of the fetch

    try {
      const response = await fetch(PRICE_CALC_SETTINGS_URL); // Make the API call

      if (response.ok) {
        const data = await response.json();
        console.log('fetchPriceCalcSettingsStart data', data);
        dispatch(fetchPriceCalcSettingsSuccess(data));
      } else {
        dispatch(fetchPriceCalcSettingsFailure('Failed to fetch information'));
      }
    } catch (error) {
      dispatch(
        fetchPriceCalcSettingsFailure(
          'An error occurred while fetching information'
        )
      );
    }
  };

interface PriceCalcSettingsState {
  priceCalcSettings: IPriceCalcSettingsAttrs | null;
  loading: boolean;
  error: string | null;
}

const initialState: PriceCalcSettingsState = {
  priceCalcSettings: null,
  loading: false,
  error: null,
};

const priceCalcSettingsSlice = createSlice({
  name: 'priceCalcSettings',
  initialState,
  reducers: {
    fetchPriceCalcSettingsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPriceCalcSettingsSuccess: (state, action: PayloadAction<any>) => {
      state.priceCalcSettings = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchPriceCalcSettingsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchPriceCalcSettingsStart,
  fetchPriceCalcSettingsSuccess,
  fetchPriceCalcSettingsFailure,
} = priceCalcSettingsSlice.actions;

export default priceCalcSettingsSlice.reducer;
