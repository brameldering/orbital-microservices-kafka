import { apiSlice } from './apiSlice';
import { PRODUCTS_URL, UPLOAD_URL } from '../constantsFrontend';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PRODUCTS_URL,
        params: { keyword, pageNumber },
      }),
      providesTags: (result, error, arg) => {
        const products = result.products;
        return products
          ? [...products.map(({ id }) => ({ type: 'Product', id })), 'Product']
          : ['Product'];
      },
      keepUnusedDataFor: 60 * 60,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: 'POST',
      }),
      invalidatesTags: ['Product'],
    }),
    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
      keepUnusedDataFor: 60 * 60,
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Product', id: arg.id },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Product', id: arg.id },
      ],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: UPLOAD_URL,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useGetTopProductsQuery,
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useUploadProductImageMutation,
} = productsApiSlice;
