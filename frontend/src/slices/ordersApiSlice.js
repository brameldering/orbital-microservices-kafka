import { apiSlice } from './apiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../constantsFrontend';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      providesTags: (result, error, arg) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Order', id })), 'Order']
          : ['Order'],
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Order'],
    }),
    getMyOrders: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/mine/${id}`,
      }),
      providesTags: (result, error, arg) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Order', id })), 'Order']
          : ['Order'],
    }),
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 60 * 60 * 24,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: details,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Order', id: arg.id }],
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Order', id: arg.id }],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} = orderApiSlice;
