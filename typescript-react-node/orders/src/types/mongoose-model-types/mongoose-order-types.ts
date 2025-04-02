import mongoose from 'mongoose';

// ================ IOrderContact ================
// export interface IOrderContactObj {
//   userId: mongoose.Types.ObjectId;
//   name: string;
//   email: string;
// }

// // Interface describing the Order Contact Model
// export interface IOrderContactModel extends mongoose.Model<IOrderContactDoc> {
//   build(attrs: IOrderContactObj): IOrderContactDoc;
// }

// // Interface describing the Order Contact Document
// export interface IOrderContactDoc extends mongoose.Document {
//   _id: mongoose.Types.ObjectId;
//   userId: mongoose.Types.ObjectId;
//   name: string;
//   email: string;
// }

// ================ IOrderItem ================
export interface IOrderItemAttrs {
  productId: mongoose.Types.ObjectId;
  productName: string;
  imageURL: string;
  price: number;
  qty: number;
}

// Interface describing the Order Item Model
export interface IOrderItemModel extends mongoose.Model<IOrderItemDoc> {
  build(attrs: IOrderItemAttrs): IOrderItemDoc;
}

// Interface describing the Order Item Document
export interface IOrderItemDoc extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  productName: string;
  imageURL: string;
  price: number;
  qty: number;
}

// =============== IOrderTotalAmount ===============
export interface IOrderTotalAmountAttrs {
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

// Interface describing the OrderTotalAmount Model
export interface IOrderTotalAmountModel
  extends mongoose.Model<IOrderTotalAmountDoc> {
  build(attrs: IOrderTotalAmountAttrs): IOrderTotalAmountDoc;
}

// Interface describing the OrderTotalAmount Document
export interface IOrderTotalAmountDoc extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

// =============== IOrder ===============
// Interface describing the Order object attributes
export interface IOrderAttrs {
  sequentialOrderId: string;
  user: {
    userId: string;
    name: string;
    email: string;
  };
  orderItems: IOrderItemAttrs[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult: {
    id?: string;
    status?: string;
    update_time?: string;
    email_address?: string;
  };
  totalAmounts?: IOrderTotalAmountAttrs;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface describing the Order Model
export interface IOrderModel extends mongoose.Model<IOrderDoc> {
  build(attrs: IOrderAttrs): IOrderDoc;
}

// Interface describing the Order Document
export interface IOrderDoc extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  sequentialOrderId: string;
  user: {
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
  };
  orderItems: mongoose.Types.DocumentArray<IOrderItemDoc>;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult: {
    id?: string;
    status?: string;
    update_time?: string;
    email_address?: string;
  };
  totalAmounts?: IOrderTotalAmountDoc;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
