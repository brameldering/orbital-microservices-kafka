import { configureStore } from '@reduxjs/toolkit';

import apiSlice from './apiSlice';
import authSliceReducer from './authSlice';
import cartSliceReducer from './cartSlice';
// import priceSettingSliceReducer from './priceSettingSlice';
// import configSliceReducer from './slices/configSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    // config: configSliceReducer,
    auth: authSliceReducer,
    cart: cartSliceReducer,
    // priceSetting: priceSettingSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
