import mongoose from 'mongoose';
import {
  IProductAttrs,
  IProductDoc,
  IProductModel,
} from '../types/mongoose-model-types/mongoose-product-types';
import { productReviewSchema } from './product-review-model';

// ====================== Product ======================
const productSchema = new mongoose.Schema(
  {
    sequentialProductId: {
      // Example: PRD-0000000001
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
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
    reviews: [productReviewSchema],
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
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        // delete ret.__v;
      },
    },
  }
);

productSchema.statics.build = (attrs: IProductAttrs) => {
  return new Product(attrs);
};

const Product = mongoose.model<IProductDoc, IProductModel>(
  'Product',
  productSchema
);

export { Product, productSchema };
