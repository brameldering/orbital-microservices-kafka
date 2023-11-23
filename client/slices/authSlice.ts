import { createSlice, createAction } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// import type { IUserInfo } from '../types/authTypes';
import { IUserInfo, IUser } from '@orbitelco/common';

// const userInfoLocalStorage =
//   typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;

// const initialState: IUserInfo = {
//   userInfo: userInfoLocalStorage ? JSON.parse(userInfoLocalStorage) : null,
// };

const initialState: IUserInfo = { userInfo: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserState: (state, action: PayloadAction<IUser>) => {
      state.userInfo = action.payload;
      // if (typeof window !== 'undefined') {
      //   localStorage.setItem('userInfo', JSON.stringify(action.payload));
      //   const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      //   localStorage.setItem('expirationTime', expirationTime.toString());
      // }
    },
    updUserState: (state, action: PayloadAction<IUser>) => {
      // Update userInfo state and localstorage in case of
      // MyProfile Update or when an admin user changes it's info using the user admin
      if (state.userInfo?.id === action.payload.id) {
        state.userInfo = action.payload;
        // if (typeof window !== 'undefined') {
        //   localStorage.setItem('userInfo', JSON.stringify(action.payload));
        // }
      }
    },
    logout: (state) => {
      state.userInfo = null;
      // if (typeof window !== 'undefined') {
      //   localStorage.clear();
      // }
    },
  },
});

// Use createAction to define the logout action without payload
const logout = createAction('auth/logout');

export const { setUserState, updUserState } = authSlice.actions;
export { logout };

export default authSlice.reducer;
