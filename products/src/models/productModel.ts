import mongoose from 'mongoose';

// Interface describing the Review object attributes
interface IReviewAttrs {
  userId: mongoose.Types.ObjectId;
  userName: string;
  rating: number;
  comment: string;
}

// Interface describing the Review Model
interface IReviewModel extends mongoose.Model<IReviewDoc> {
  build(attrs: IReviewAttrs): IReviewDoc;
}

// Interface describing the Review Document
interface IReviewDoc extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  rating: number;
  comment: string;
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

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

reviewSchema.statics.build = (attrs: IReviewAttrs) => {
  return new Review(attrs);
};

const Review = mongoose.model<IReviewDoc, IReviewModel>('Review', reviewSchema);

// =========================================================

// Interface describing the Product object attributes
export interface IProductAttrs {
  // sequenceProductId: string;
  name: string;
  imageURL: string;
  brand: string;
  category: string;
  description: string;
  numReviews: number;
  reviews?: [IReviewDoc];
  rating?: number;
  price: number;
  countInStock: number;
  // userId: mongoose.Types.ObjectId;
}

// Interface describing the Product Model
interface IProductModel extends mongoose.Model<IProductDoc> {
  build(attrs: IProductAttrs): IProductDoc;
}

// Interface describing the Product Document
interface IProductDoc extends mongoose.Document {
  // sequenceProductId: string;
  name: string;
  imageURL: string;
  brand: string;
  category: string;
  description: string;
  numReviews: number;
  reviews?: [IReviewDoc];
  rating?: number;
  price: number;
  countInStock: number;
  // userId: mongoose.Types.ObjectId;
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

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

productSchema.statics.build = (attrs: IProductAttrs) => {
  return new Product(attrs);
};

export const Product = mongoose.model<IProductDoc, IProductModel>(
  'Product',
  productSchema
);
