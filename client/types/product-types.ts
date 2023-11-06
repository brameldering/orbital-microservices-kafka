export interface IGetProductsPaginated {
  products: Array<IProduct>;
  page: number;
  pages: number;
}

export interface IBaseProduct {
  id: string;
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
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
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
