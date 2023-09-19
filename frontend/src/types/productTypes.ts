export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewInput {
  productId: string;
  rating: number;
  comment: string;
}

export interface ProductType {
  _id: string;
  sequenceProductId: string;
  user: string;
  name: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  reviews: Array<Review>;
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewUpdateProduct {
  productId: string;
  productIdSeq: string;
  name: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
}

export interface GetProductsRes {
  products: Array<ProductType>;
  page: number;
  pages: number;
}

export interface UploadProductImageResponse {
  message: string;
  image: string;
}
