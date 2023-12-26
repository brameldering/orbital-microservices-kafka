import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

import { BASE_URL } from 'constants/constants-frontend';

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL, credentials: 'include' });

const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'ApiAccess'], // 'Order', 'User',
  keepUnusedDataFor: 60,
  endpoints: () => ({}),
});

export default apiSlice;
