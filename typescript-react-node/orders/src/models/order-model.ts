import mongoose from 'mongoose';
import {
  IOrderAttrs,
  IOrderDoc,
  IOrderModel,
} from '../types/mongoose-model-types/mongoose-order-types';
import { orderItemSchema } from './order-item-model';
import { orderTotalAmountsSchema } from './order-total-amounts-model';

// ======================== Order ========================
const orderSchema = new mongoose.Schema(
  {
    sequentialOrderId: {
      // Example: ORD-0000000001
      type: String,
      required: true,
    },
    user: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // ref: 'OrderContact',
      },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
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
      },
    },
  }
);

// orderSchema.virtual('orderContact', {
//   ref: 'OrderContact',
//   localField: 'orderContactId',
//   foreignField: '_id',
//   justOne: true,
// });

// orderSchema.set('toObject', { virtuals: true });
// orderSchema.set('toJSON', { virtuals: true });

orderSchema.statics.build = (attrs: IOrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<IOrderDoc, IOrderModel>('Order', orderSchema);

export { Order, orderSchema };
