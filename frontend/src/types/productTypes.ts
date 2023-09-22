export interface IGetProductsPaginated {
  products: Array<IProduct>;
  page: number;
  pages: number;
}

export interface IBaseProduct {
  _id: string;
  sequenceProductId: string;
  name: string;
  imageURL: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
}

export interface IProduct extends IBaseProduct {
  numReviews: number;
  reviews: Array<IReview>;
  rating: number;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IReview {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReviewInput {
  productId: string;
  rating: number;
  comment: string;
}

export interface IUploadImageResponse {
  message: string;
  imageURL: string;
}
