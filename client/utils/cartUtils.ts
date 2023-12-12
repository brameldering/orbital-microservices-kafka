'use client';
import { ICart, calcPrices } from '@orbitelco/common';
// import { IFeesConfig } from '@orbitelco/common';
import {
  VAT_PERCENTAGE,
  SHIPPING_FEE,
  THRESHOLD_FREE_SHIPPING,
} from 'constants/constants-frontend';

export const updateCart = (state: ICart) => {
  // const configInfoLocalStorage: string | null =
  //   localStorage.getItem('configInfo');

  // if (!configInfoLocalStorage) {
  //   throw new Error(
  //     'Error, cannot update cart because of a problem with the local browser storage'
  //   );
  // }
  // const feesConfig: IFeesConfig = JSON.parse(configInfoLocalStorage);

  const totalAmounts = calcPrices(
    state.cartItems,
    VAT_PERCENTAGE,
    SHIPPING_FEE,
    THRESHOLD_FREE_SHIPPING
  );

  state.totalAmounts.itemsPrice = totalAmounts.itemsPrice;
  state.totalAmounts.shippingPrice = totalAmounts.shippingPrice;
  state.totalAmounts.taxPrice = totalAmounts.taxPrice;
  state.totalAmounts.totalPrice = totalAmounts.totalPrice;

  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
