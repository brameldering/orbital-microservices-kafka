import { createSlice, createAction } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserInfo } from '../types/authTypes';
import { User } from '../types/userTypes';

const userInfoLocalStorage: string | null = localStorage.getItem('userInfo');

const initialState: UserInfo = {
  userInfo: userInfoLocalStorage ? JSON.parse(userInfoLocalStorage) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.userInfo = action.payload;

      localStorage.setItem('userInfo', JSON.stringify(action.payload));

      const expirationTime: number =
        new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem('expirationTime', expirationTime.toString());
    },
    logout: (state, action) => {
      state.userInfo = null;
      // NOTE: here we need to also remove the cart from storage so the next
      // logged in user doesn't inherit the previous users cart and shipping
      localStorage.clear();
    },
  },
});

// Use createAction to define the logout action without payload
const logout = createAction('auth/logout');

export const { setCredentials } = authSlice.actions;
export { logout };

export default authSlice.reducer;
