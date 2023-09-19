export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
}

export interface Address {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CartInfo {
  cartItems: Array<CartItem>;
  shippingAddress: Address;
  paymentMethod: string;
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
  totalPrice: string;
}
