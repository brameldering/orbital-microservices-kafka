import { createSlice, createAction } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// import type { IUserInfo } from '../types/authTypes';
import { IBasicUserInfo, IBasicUser } from '@orbitelco/common';

const userInfoLocalStorage: string | null = localStorage.getItem('userInfo');

const initialState: IBasicUserInfo = {
  userInfo: userInfoLocalStorage ? JSON.parse(userInfoLocalStorage) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<IBasicUser>) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      const expirationTime: number =
        new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem('expirationTime', expirationTime.toString());
    },
    setUserInfo: (state, action: PayloadAction<IBasicUser>) => {
      // Update userInfo state and localstorage in case of
      // MyProfile Update or when an admin user changes it's info using the user admin
      if (state.userInfo?.id === action.payload.id) {
        state.userInfo = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear();
    },
  },
});

// Use createAction to define the logout action without payload
const logout = createAction('auth/logout');

export const { setCredentials, setUserInfo } = authSlice.actions;
export { logout };

export default authSlice.reducer;
