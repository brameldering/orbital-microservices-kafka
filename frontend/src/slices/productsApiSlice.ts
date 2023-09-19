import { apiSlice } from './apiSlice';
import { PRODUCTS_URL, UPLOAD_URL } from '../constantsFrontend';
import {
  ProductType,
  NewUpdateProduct,
  GetProductsRes,
  ReviewInput,
  UploadProductImageResponse,
} from '../types/productTypes';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      GetProductsRes,
      { keyword?: string; pageNumber?: string }
    >({
      query: ({ keyword, pageNumber }) => ({
        url: PRODUCTS_URL,
        params: { keyword, pageNumber },
      }),
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation<NewUpdateProduct, void>({
      query: () => ({
        url: PRODUCTS_URL,
        method: 'POST',
      }),
      invalidatesTags: ['Product'],
    }),
    getProductDetails: builder.query<ProductType, string>({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    updateProduct: builder.mutation<ProductType, NewUpdateProduct>({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
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
    createReview: builder.mutation<void, ReviewInput>({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => {
        if (error) {
          return [];
        }
        // Invalidate the cache for the specific order
        return [{ type: 'Product', id: productId }];
      },
    }),
    uploadProductImage: builder.mutation<UploadProductImageResponse, FormData>({
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
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useUploadProductImageMutation,
} = productsApiSlice;
