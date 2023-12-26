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
    }),
    getProductById: builder.query<IProduct, string>({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
    }),
    createProduct: builder.mutation<IBaseProduct, void>({
      query: () => ({
        url: PRODUCTS_URL,
        method: 'POST',
      }),
    }),
    updateProduct: builder.mutation<IProduct, IBaseProduct>({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
    }),
    createReview: builder.mutation<void, IReviewInput>({
      query: (data) => ({
        url: `${PRODUCT_REVIEW_URL}/${data.productId}`,
        method: 'POST',
        body: data,
      }),
    }),
    uploadImage: builder.mutation<IUploadImageResponse, FormData>({
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
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useUploadImageMutation,
} = productsApiSlice;
