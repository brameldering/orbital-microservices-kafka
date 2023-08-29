import { configureStore } from '@reduxjs/toolkit';
import { addListener } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import cartSliceReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

addListener(store.dispatch, {
  onQueryStarted: (query) => {
    console.log(`Query ${query.requestId} started`);
  },
  onQueryFulfilled: (query) => {
    console.log(`Query ${query.requestId} fulfilled with data`, query.data);
  },
  onQueryRejected: (query) => {
    console.error(`Query ${query.requestId} rejected with error`, query.error);
  },
});

export default store;
