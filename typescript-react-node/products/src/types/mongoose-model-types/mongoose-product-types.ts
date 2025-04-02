import mongoose from 'mongoose';

// Interface describing the Review object attributes
export interface IProductReviewAttrs {
  userId: mongoose.Types.ObjectId;
  userName: string;
  rating: number;
  comment: string;
}

// Interface describing the Review Model
export interface IProductReviewModel extends mongoose.Model<IProductReviewDoc> {
  build(attrs: IProductReviewAttrs): IProductReviewDoc;
}

// Interface describing the Review Document
export interface IProductReviewDoc extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// =========================================================
// Interface describing the Product object attributes
export interface IProductAttrs {
  sequentialProductId: string;
  name: string;
  imageURL: string;
  brand: string;
  category: string;
  description: string;
  numReviews: number;
  reviews?: IProductReviewAttrs[];
  rating?: number;
  price: number;
  countInStock: number;
  userId: mongoose.Types.ObjectId;
}

// Interface describing the Product Model
export interface IProductModel extends mongoose.Model<IProductDoc> {
  build(attrs: IProductAttrs): IProductDoc;
}

// Interface describing the Product Document
export interface IProductDoc extends mongoose.Document {
  sequentialProductId: string;
  name: string;
  imageURL: string;
  brand: string;
  category: string;
  description: string;
  numReviews: number;
  reviews?: IProductReviewDoc[];
  rating?: number;
  price: number;
  countInStock: number;
  userId: mongoose.Types.ObjectId;
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
