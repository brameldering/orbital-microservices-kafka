export interface OrderItem {
  _id?: string;
  productId: string;
  name: string;
  qty: number;
  image: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

export interface Order {
  _id?: string;
  sequenceOrderId?: string;
  user?: User;
  orderItems: Array<OrderItem>;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
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

export interface PayPalClientId {
  clientId: string;
}
