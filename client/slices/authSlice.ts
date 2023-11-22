import { createSlice, createAction } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { IUserInfo, IUser } from '@orbitelco/common';

const initialState: IUserInfo = { userInfo: { name: '', email: '', role: '' } };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // setCredentials: (state, action: PayloadAction<IUser>) => {
    //   state.userInfo = action.payload;
    // },
    setUserInfo: (state, action: PayloadAction<IUser>) => {
      // Update userInfo state in case of MyProfile Update
      //  or when an admin user changes it's info using the user admin
      if (state.userInfo?.id === action.payload.id) {
        state.userInfo = action.payload;
      }
    },
    logout: (state) => {
      state.userInfo = null;
    },
  },
});

// Use createAction to define the logout action without payload
const logout = createAction('auth/logout');

export const { setUserInfo } = authSlice.actions;
export { logout };

export default authSlice.reducer;
