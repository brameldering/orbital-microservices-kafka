import {
  PRODUCT_INVENTORY_URL,
  INVENTORY_SERIALS_URL,
  IInventory,
} from '@orbital_app/common';

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
    updateSerialNumber: builder.mutation<
      IInventory,
      { productId: string; serialNumber: string; status: string }
    >({
      query: ({ productId, serialNumber, status }) => ({
        url: `${INVENTORY_SERIALS_URL}/${productId}/${serialNumber}`,
        method: 'PUT',
        body: { status: status },
      }),
    }),
  }),
});

export const {
  useGetInventoryByIdQuery,
  useUpdateInventoryMutation,
  useUpdateSerialNumberMutation,
} = inventoryApiSlice;
