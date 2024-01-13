import { createSlice, createAction } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IUserInfo, IUser } from '@orbital_app/common';

const initialState: IUserInfo = { userInfo: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserState: (state, action: PayloadAction<IUser>) => {
      state.userInfo = action.payload;
    },
    updUserState: (state, action: PayloadAction<IUser>) => {
      // Update the userInfo stateonly when the logged in user is the same as user being updated
      // This is the case of MyProfile Update or when an admin user changes it's info in the User Edit screen
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

export const { setUserState, updUserState } = authSlice.actions;
export { logout };

export default authSlice.reducer;
