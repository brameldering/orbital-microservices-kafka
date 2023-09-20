import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Cart, CartItem, ShippingAddress } from '../types/cartTypes';

// Define the initial state
const cartInfoLocalStorage: string | null = localStorage.getItem('cart');

const initialState: Cart = cartInfoLocalStorage
  ? JSON.parse(cartInfoLocalStorage)
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

// Create the cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
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

      // Assuming updateCart modifies the cart in some way
      return updateCart(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (x) => x.productId !== action.payload
      );
      // Assuming updateCart modifies the cart in some way
      return updateCart(state);
    },
    saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
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
    resetCart: (state) => {
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
