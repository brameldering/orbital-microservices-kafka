import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { ICart, ICartItem } from '../types/cartTypes';
import type { IShippingAddress, ITotalAmounts } from '../types/commonTypes';
import { updateCart } from '../utils/cartUtils';

// Define the initial state
const cartInfoLocalStorage: string | null = localStorage.getItem('cart');

const initialTotalAmounts: ITotalAmounts = {
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
};

const initialState: ICart = cartInfoLocalStorage
  ? JSON.parse(cartInfoLocalStorage)
  : {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: 'PayPal',
      totalAmounts: initialTotalAmounts,
    };

// Create the cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ICartItem>) => {
      const cartItem = action.payload;

      const existItem = state.cartItems.find(
        (x) => x.productId === cartItem.productId
      );

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.productId === existItem.productId ? cartItem : x
        );
      } else {
        state.cartItems = [...state.cartItems, cartItem];
      }
      localStorage.setItem('cart', JSON.stringify(state));
      return updateCart(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (x) => x.productId !== action.payload
      );

      localStorage.setItem('cart', JSON.stringify(state));
      return updateCart(state);
    },
    saveShippingAddress: (state, action: PayloadAction<IShippingAddress>) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
    resetCart: () => {
      // Reset the state to the initial state
      return initialState;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
