// import { IFeesConfig } from '../types/configTypes';
import {
  ORDERS_URL,
  MY_ORDERS_URL,
  UPDATE_ORDER_TO_PAID_URL,
  UPDATE_ORDER_TO_DELIVERED_URL,
  GET_PAYPAL_CLIENT_ID_URL,
  IOrder,
  IPaymentResult,
  IPayPalClientId,
  // ITotalAmounts,
  // ICartItem,
} from '@orbitelco/common';

import apiSlice from './apiSlice';

// Define an API slice for orders
export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get a list of orders
    getOrders: builder.query<IOrder[], void>({
      query: () => ({
        url: ORDERS_URL,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),
    // Create a new order
    createOrder: builder.mutation<IOrder, IOrder>({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Order'],
    }),
    // Get a list of orders for the current user
    getMyOrders: builder.query<IOrder[], void>({
      query: () => ({
        url: `${MY_ORDERS_URL}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),
    // Set order isPaid status to true and set payment details and set paidAt date
    setPayData: builder.mutation<
      IOrder,
      { orderId: string; details: IPaymentResult }
    >({
      query: ({ orderId, details }) => ({
        url: `${UPDATE_ORDER_TO_PAID_URL}/${orderId}`,
        method: 'PUT',
        body: details,
      }),
      invalidatesTags: (result, error, { orderId }) => {
        if (error) {
          return [];
        }
        // Invalidate the cache for the specific order
        return [{ type: 'Order', id: orderId }];
      },
    }),
    // Set order isDelivered status to true and set deliveredAt date
    setDeliverData: builder.mutation<IOrder, string>({
      query: (orderId) => ({
        url: `${UPDATE_ORDER_TO_DELIVERED_URL}/${orderId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, orderId) => {
        if (error) {
          return [];
        }
        // Invalidate the cache for the specific order
        return [{ type: 'Order', id: orderId }];
      },
    }),
    // Get order details by ID
    getOrderById: builder.query<IOrder, string>({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    // // Get total prices for items array
    // calcTotalAmounts: builder.mutation<ITotalAmounts, ICartItem[]>({
    //   query: (order) => ({
    //     url: `${ORDERS_URL}/totals`,
    //     method: 'POST',
    //     body: order,
    //   }),
    // }),
    // // Get the VAT Percentage and Shipping Fee from .env
    // getVATandShippingFee: builder.query<IFeesConfig, void>({
    //   query: () => ({
    //     url: GET_VAT_AND_SHIPPING_FEE_URL,
    //   }),
    //   keepUnusedDataFor: 60 * 60 * 24,
    // }),
    // Get the PayPal client ID
    getPaypalClientId: builder.query<IPayPalClientId, void>({
      query: () => ({
        url: GET_PAYPAL_CLIENT_ID_URL,
      }),
      keepUnusedDataFor: 60 * 60 * 24,
    }),
  }),
});

// Export generated hooks for API endpoints
export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useSetPayDataMutation,
  useSetDeliverDataMutation,
  // useCalcTotalAmountsMutation,
  // useGetVATandShippingFeeQuery,
  useGetPaypalClientIdQuery,
} = orderApiSlice;
