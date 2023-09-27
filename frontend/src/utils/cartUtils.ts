import { ICart } from '../types/cartTypes';
import { IFeesConfig } from '../types/configTypes';

const roundTo2Decimals = (num: number): number => {
  return Math.round(num * 100) / 100;
};

export const updateCart = (state: ICart) => {
  const configInfoLocalStorage: string | null =
    localStorage.getItem('configInfo');

  if (!configInfoLocalStorage) {
    throw new Error('TO DO === HANDLE THIS ERROR');
  }

  const feesConfig: IFeesConfig = JSON.parse(configInfoLocalStorage);

  state.itemsPrice = roundTo2Decimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  state.shippingPrice = roundTo2Decimals(
    state.cartItems.length === 0 || state.itemsPrice > 100
      ? 0
      : feesConfig.ShippingFee
  );
  state.taxPrice = roundTo2Decimals(
    (roundTo2Decimals(feesConfig.VATPercentage) / 100) * state.itemsPrice
  );
  state.totalPrice = roundTo2Decimals(
    state.itemsPrice + state.shippingPrice + state.taxPrice
  );

  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
