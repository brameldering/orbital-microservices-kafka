import mongoose from 'mongoose';
import {
  IReviewObj,
  IReviewDoc,
  IReviewModel,
  IProductObj,
  IProductDoc,
  IProductModel,
} from '@orbitelco/common';

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    userName: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

reviewSchema.statics.build = (attrs: IReviewObj) => {
  return new Review(attrs);
};

const Review = mongoose.model<IReviewDoc, IReviewModel>('Review', reviewSchema);

// ================================================================================

const productSchema = new mongoose.Schema(
  {
    sequenceProductId: {
      type: String,
      required: false, // true
      unique: false, // true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    imageURL: {
      type: String,
      required: false,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, // true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

productSchema.statics.build = (attrs: IProductObj) => {
  return new Product(attrs);
};

const Product = mongoose.model<IProductDoc, IProductModel>(
  'Product',
  productSchema
);

export { Review, Product };
