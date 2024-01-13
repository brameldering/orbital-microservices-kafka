'use client';
import {
  ICart,
  calcPrices,
  IPriceCalcSettingsAttrs,
} from '@orbital_app/common';

export const updateCart = (
  state: ICart,
  priceCalcSettings: IPriceCalcSettingsAttrs
) => {
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
    priceCalcSettings.vatPercentage,
    priceCalcSettings.shippingFee,
    priceCalcSettings.thresholdFreeShipping
  );

  state.totalAmounts.itemsPrice = totalAmounts.itemsPrice;
  state.totalAmounts.shippingPrice = totalAmounts.shippingPrice;
  state.totalAmounts.taxPrice = totalAmounts.taxPrice;
  state.totalAmounts.totalPrice = totalAmounts.totalPrice;

  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
