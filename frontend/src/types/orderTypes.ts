import { IShippingAddress, ITotalAmounts } from './commonTypes';
import { IUser } from './userTypes';

export interface IOrder {
  _id?: string;
  sequenceOrderId?: string;
  user?: IUser;
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

export interface IOrderItem {
  _id?: string;
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
