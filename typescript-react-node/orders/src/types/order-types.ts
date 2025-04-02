import { IShippingAddress, ITotalAmounts } from './common-types';

export interface IOrder {
  id?: string;
  sequentialOrderId?: string;
  user?: IOrderUser;
  orderItems: Array<IOrderItem>;
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentResult?: IPaymentResult;
  totalAmounts: ITotalAmounts;
  isPaid?: boolean;
  paidAt?: Date;
  isDelivered?: boolean;
  deliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderUser {
  userId: string;
  name: string;
  email: string;
}

export interface IOrderItem {
  id?: string;
  productId: string;
  productName: string;
  imageURL: string;
  price: number;
  qty: number;
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
