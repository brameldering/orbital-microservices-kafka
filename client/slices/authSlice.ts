import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  ICurrentUser,
  IUserInfo,
  IUser,
  CURRENT_USER_URL,
} from '@orbitelco/common';

// Used to fetch user info upon initialization from cookie
const fetchUserInfo = createAsyncThunk<ICurrentUser, void>(
  'auth/fetchUserInfo',
  async () => {
    try {
      // Perform API call to retrieve user info from session cookie
      const response = await fetch(CURRENT_USER_URL);
      if (response.ok) {
        const userData = await response.json();
        return userData as ICurrentUser;
      }
      throw new Error('Failed to fetch user info');
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }
);

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
  extraReducers: (builder) => {
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.userInfo = action.payload;
    });
  },
});

// Use createAction to define the logout action without payload
const logout = createAction('auth/logout');

export const { setUserState, updUserState } = authSlice.actions;
export { logout };

export const initializeUser = () => async (dispatch: any) => {
  try {
    const actionResult = await dispatch(fetchUserInfo()); // Dispatch the async action

    // 'actionResult' is the value returned from the dispatched action
    if (fetchUserInfo.fulfilled.match(actionResult)) {
      // Check if the dispatched action is fulfilled
      const userData = actionResult.payload; // Extract the user data from the payload

      // Do something with the user data, e.g., dispatch another action or set it to the state
      dispatch(setUserState(userData));
    } else {
      // Handle other cases like pending, rejected, etc.
      // For example:
      console.error('Error fetching user info:', actionResult.error);
    }
  } catch (error) {
    console.error('Error initializing user info:', error);
  }
};

export default authSlice.reducer;
