import mongoose from 'mongoose';
import {
  IOrderItemAttrs,
  IOrderItemDoc,
  IOrderItemModel,
} from '../types/mongoose-model-types/mongoose-order-types';

// ====================== OrderItem ======================
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

orderItemSchema.statics.build = (attrs: IOrderItemAttrs) => {
  return new OrderItem(attrs);
};

const OrderItem = mongoose.model<IOrderItemDoc, IOrderItemModel>(
  'OrderItem',
  orderItemSchema
);

export { OrderItem, orderItemSchema };
