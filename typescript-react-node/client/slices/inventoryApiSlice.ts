import { INVENTORY_PRODUCTS_URL, IInventory } from '@orbital_app/common';

import apiSlice from './apiSlice';

export const inventoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInventoryById: builder.query<IInventory, string>({
      query: (id) => ({
        url: `${INVENTORY_PRODUCTS_URL}/${id}`,
      }),
    }),
    updateInventory: builder.mutation<IInventory, IInventory>({
      query: (data) => ({
        url: `${INVENTORY_PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const { useGetInventoryByIdQuery, useUpdateInventoryMutation } =
  inventoryApiSlice;
