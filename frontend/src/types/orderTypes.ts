import { IShippingAddress } from './commonTypes';
import { IUser } from './userTypes';

export interface IOrder {
  _id?: string;
  sequenceOrderId?: string;
  user?: IUser;
  orderItems: Array<IOrderItem>;
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentResult?: IPaymentResult;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid?: boolean;
  paidAt?: string;
  isDelivered?: boolean;
  deliveredAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IOrderItem {
  _id?: string;
  productId: string;
  productName: string;
  imageURL: string;
  price: number;
  qty: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

export interface IPayPalClientId {
  clientId: string;
}
