import mongoose from 'mongoose';
import {
  IOrderItemObj,
  IOrderItemDoc,
  IOrderItemModel,
  IOrderObj,
  IOrderDoc,
  IOrderModel,
} from '@orbitelco/common';

// OrderItem
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // ref: 'Product',
  },
  productName: { type: String, required: true },
  imageURL: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
});

orderItemSchema.statics.build = (attrs: IOrderItemObj) => {
  return new OrderItem(attrs);
};

const OrderItem = mongoose.model<IOrderItemDoc, IOrderItemModel>(
  'OrderItem',
  orderItemSchema
);

// Order Total Amount
const orderTotalAmountsSchema = new mongoose.Schema({
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
});

// Order
const orderSchema = new mongoose.Schema(
  {
    // sequenceOrderId: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // ref: 'User',
    },
    // userName: {
    //   type: String,
    //   required: true,
    // },
    // userEmail: {
    //   type: String,
    //   required: true,
    // },
    orderItems: [orderItemSchema],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    totalAmounts: orderTotalAmountsSchema,
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
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

// orderSchema.virtual('user', {
//   ref: 'User',
//   localField: 'userId',
//   foreignField: '_id',
//   justOne: true,
// });

// orderSchema.set('toObject', { virtuals: true });
// orderSchema.set('toJSON', { virtuals: true });

orderSchema.statics.build = (attrs: IOrderObj) => {
  return new Order(attrs);
};

const Order = mongoose.model<IOrderDoc, IOrderModel>('Order', orderSchema);

export { Order, OrderItem };
