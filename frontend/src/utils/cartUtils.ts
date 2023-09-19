import { CartInfo } from '../types/cartTypes';

export const addDecimals = (num: number): string => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state: CartInfo) => {
  // Calculate the items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce(
      (acc, item) => acc + Number(item.price) * Number(item.qty),
      0
    )
  );

  // Calculate the shipping price: if order is over 100 then 0 otherwise 10
  state.shippingPrice = addDecimals(Number(state.itemsPrice) > 100 ? 0 : 10);

  // Calculate the tax price
  state.taxPrice = addDecimals(Number(0.15 * Number(state.itemsPrice)));

  // Calculate the total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // Save the cart to localStorage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
