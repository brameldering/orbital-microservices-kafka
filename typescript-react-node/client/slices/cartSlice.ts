import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  ICart,
  ICartItemWithSettings,
  IRemoveFromCart,
  IShippingAddress,
  ITotalAmounts,
} from '@orbital_app/common';
import { updateCart } from 'utils/cartUtils';

// Define the initial state
let cartInfoLocalStorage: string | null;
if (typeof window !== 'undefined') {
  cartInfoLocalStorage = localStorage.getItem('cart');
} else {
  cartInfoLocalStorage = null;
}

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
    addToCart: (state, action: PayloadAction<ICartItemWithSettings>) => {
      const cartItem = action.payload.cartItem;

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
      const priceCalcSettings = action.payload.priceCalcSettings;
      return updateCart(state, priceCalcSettings);
    },
    removeFromCart: (state, action: PayloadAction<IRemoveFromCart>) => {
      state.cartItems = state.cartItems.filter(
        (x) => x.productId !== action.payload.id
      );
      localStorage.setItem('cart', JSON.stringify(state));
      return updateCart(state, action.payload.priceCalcSettings);
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
    resetCart: () =>
      // Reset the state to the initial state
      initialState,
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
