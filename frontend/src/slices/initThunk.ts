import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { BASE_URL, PRODUCTS_URL } from '../constantsFrontend';

// Define the state type
export interface ITestAPIState {
  data: any | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

export const testAPIAvailability: any = createAsyncThunk(
  'testAPIAvailability',
  async () => {
    try {
      const response = await fetch(BASE_URL + '/' + PRODUCTS_URL);
      console.log('===>> Response');
      console.log(response);
      if (!response.ok) {
        console.log('===>>> ! response.ok');
        console.log(response);
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      console.log('===>>> data ');
      console.log(data);
      return data;
    } catch (error: any) {
      console.log('===>>> catch error ');
      console.log(error);
      throw error.message;
    }
  }
);

const testAPISlice = createSlice({
  name: 'testAPI',
  initialState: {
    data: null,
    loading: 'idle',
    error: null,
  } as ITestAPIState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(testAPIAvailability.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(testAPIAvailability.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.data = action.payload;
      })
      .addCase(testAPIAvailability.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || null; // Access the error message here
      });
  },
});

export default testAPISlice.reducer;
