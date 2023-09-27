import { IShippingAddress } from './commonTypes';

export interface ICart {
  cartItems: Array<ICartItem>;
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

export interface ICartItem {
  productId: string;
  name: string;
  imageURL: string;
  price: number;
  countInStock: number;
  qty: number;
}
