'use client';
import { ICart } from '@orbitelco/common';
// import { IFeesConfig } from '@orbitelco/common';
import {
  VAT_PERCENTAGE,
  SHIPPING_FEE,
  THRESHOLD_FREE_SHIPPING,
} from '../constants/constants-frontend';

const roundTo2Decimals = (num: number): number => Math.round(num * 100) / 100;

export const updateCart = (state: ICart) => {
  // const configInfoLocalStorage: string | null =
  //   localStorage.getItem('configInfo');

  // if (!configInfoLocalStorage) {
  //   throw new Error(
  //     'Error, cannot update cart because of a problem with the local browser storage'
  //   );
  // }
  // const feesConfig: IFeesConfig = JSON.parse(configInfoLocalStorage);

  state.totalAmounts.itemsPrice = roundTo2Decimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  state.totalAmounts.shippingPrice = roundTo2Decimals(
    state.cartItems.length === 0 ||
      state.totalAmounts.itemsPrice > THRESHOLD_FREE_SHIPPING
      ? 0
      : SHIPPING_FEE
  );
  state.totalAmounts.taxPrice = roundTo2Decimals(
    (roundTo2Decimals(VAT_PERCENTAGE) / 100) * state.totalAmounts.itemsPrice
  );
  state.totalAmounts.totalPrice = roundTo2Decimals(
    state.totalAmounts.itemsPrice +
      state.totalAmounts.shippingPrice +
      state.totalAmounts.taxPrice
  );

  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
