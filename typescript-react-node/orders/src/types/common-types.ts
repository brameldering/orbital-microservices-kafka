export interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface ITotalAmounts {
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

export interface IPriceCalcSettingsAttrs {
  vatPercentage: number;
  shippingFee: number;
  thresholdFreeShipping: number;
}
