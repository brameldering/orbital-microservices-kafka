import {
  PRODUCTS_URL,
  PRODUCT_REVIEW_URL,
  UPLOAD_URL,
  IBaseProduct,
  IProduct,
  IGetProductsPaginated,
  IReviewInput,
  IUploadImageResponse,
} from '@orbitelco/common';

import apiSlice from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      IGetProductsPaginated,
      { keyword?: string; pagenumber?: string }
    >({
      query: ({ keyword, pagenumber }) => ({
        url: PRODUCTS_URL,
        params: { keyword, pagenumber },
      }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query<IProduct, string>({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation<IBaseProduct, void>({
      query: () => ({
        url: PRODUCTS_URL,
        method: 'POST',
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<IProduct, IBaseProduct>({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    createReview: builder.mutation<void, IReviewInput>({
      query: (data) => ({
        url: `${PRODUCT_REVIEW_URL}/${data.productId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    uploadImage: builder.mutation<IUploadImageResponse, FormData>({
      query: (data) => ({
        url: UPLOAD_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useUploadImageMutation,
} = productsApiSlice;
