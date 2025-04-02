import { IShippingAddress, ITotalAmounts } from './common-types';
import { IPriceCalcSettingsAttrs } from './common-types';

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

// To pass to AddToCart reducer
export interface ICartItemWithSettings {
  cartItem: ICartItem;
  priceCalcSettings: IPriceCalcSettingsAttrs;
}

// To pass to RemoveFromCart reducer
export interface IRemoveFromCart {
  id: string;
  priceCalcSettings: IPriceCalcSettingsAttrs;
}
