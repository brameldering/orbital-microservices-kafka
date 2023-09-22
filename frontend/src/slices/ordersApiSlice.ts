import { apiSlice } from './apiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../constantsFrontend';
import { IOrder, IPaymentResult, IPayPalClientId } from '../types/orderTypes';

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
              ...result.map(({ _id }) => ({ type: 'Order' as const, id: _id })),
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
    getMyOrders: builder.query<IOrder[], string>({
      query: (id) => ({
        url: `${ORDERS_URL}/mine/${id}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Order' as const, id: _id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    // Get order details by ID
    getOrderDetails: builder.query<IOrder, string>({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    // Get the PayPal client ID
    getPaypalClientId: builder.query<IPayPalClientId, void>({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    // Pay for an order
    payOrder: builder.mutation<
      IOrder,
      { orderId: string; details: IPaymentResult }
    >({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
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

    // Deliver an order
    deliverOrder: builder.mutation<IOrder, string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
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
  }),
});

// Export generated hooks for API endpoints
export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} = orderApiSlice;
