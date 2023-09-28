import { createSlice, createAction } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IUserInfo } from '../types/authTypes';
import { IUser } from '../types/userTypes';

const userInfoLocalStorage: string | null = localStorage.getItem('userInfo');

const initialState: IUserInfo = {
  userInfo: userInfoLocalStorage ? JSON.parse(userInfoLocalStorage) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<IUser>) => {
      state.userInfo = action.payload;

      localStorage.setItem('userInfo', JSON.stringify(action.payload));

      const expirationTime: number =
        new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem('expirationTime', expirationTime.toString());
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.clear();
    },
  },
});

// Use createAction to define the logout action without payload
const logout = createAction('auth/logout');

export const { setCredentials } = authSlice.actions;
export { logout };

export default authSlice.reducer;
