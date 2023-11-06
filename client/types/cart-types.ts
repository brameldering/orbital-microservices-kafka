import { IShippingAddress, ITotalAmounts } from './common-types';

export interface ICart {
  cartItems: Array<ICartItem>;
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  totalAmounts: ITotalAmounts;
}

export interface ICartItem {
  productId: string;
  productName: string;
  imageURL: string;
  price: number;
  countInStock: number;
  qty: number;
}
