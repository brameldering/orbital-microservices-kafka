import { PRODUCT_INVENTORY_URL } from 'constants/url-constants';
import { IInventory } from 'types/inventory-types';

import apiSlice from './apiSlice';

export const inventoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInventoryById: builder.query<IInventory, string>({
      query: (id) => ({
        url: `${PRODUCT_INVENTORY_URL}/${id}`,
      }),
    }),
    updateInventory: builder.mutation<IInventory, IInventory>({
      query: (data) => ({
        url: `${PRODUCT_INVENTORY_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const { useGetInventoryByIdQuery, useUpdateInventoryMutation } =
  inventoryApiSlice;
