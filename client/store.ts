import { configureStore } from '@reduxjs/toolkit';

import apiSlice from './slices/apiSlice';
// import authSliceReducer from './slices/authSlice';
// import cartSliceReducer from './slices/cartSlice';
// import configSliceReducer from './slices/configSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    // config: configSliceReducer,
    // auth: authSliceReducer,
    // cart: cartSliceReducer,
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
