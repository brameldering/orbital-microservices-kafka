export enum OrderStatus {
  Created = 'created',
  Cancelled = 'cancelled',
  // Product instance has been reserved and is awaiting payment
  AwaitingPayment = 'awaiting:payment',
  // Product has been paid and is
  BeingDelivered = 'being:delivered',
  // The order has been paid and delivered
  Complete = 'complete',
}
