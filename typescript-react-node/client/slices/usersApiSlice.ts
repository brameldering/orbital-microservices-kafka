import {
  USERS_URL,
  SIGN_UP_URL,
  SIGN_IN_URL,
  SIGN_OUT_URL,
  RESET_PASSWORD_URL,
  UPDATE_PASSWORD_URL,
  UPDATE_PROFILE_URL,
  IUser,
  ISignUp,
  ISignIn,
  IChangeUserProfile,
  IChangePassword,
  IResetPassword,
} from '@orbital_app/common';

import apiSlice from './apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation<IUser, ISignUp>({
      query: (data) => ({
        url: SIGN_UP_URL,
        method: 'POST',
        body: data,
      }),
    }),
    signIn: builder.mutation<IUser, ISignIn>({
      query: (data) => ({
        url: SIGN_IN_URL,
        method: 'POST',
        body: data,
      }),
    }),
    signOut: builder.mutation<void, void>({
      query: () => ({
        url: SIGN_OUT_URL,
        method: 'POST',
      }),
    }),
    changeUserProfile: builder.mutation<IUser, IChangeUserProfile>({
      query: (data) => ({
        url: UPDATE_PROFILE_URL,
        method: 'PUT',
        body: data,
      }),
    }),
    changePassword: builder.mutation<IUser, IChangePassword>({
      query: (data) => ({
        url: UPDATE_PASSWORD_URL,
        method: 'PUT',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<void, IResetPassword>({
      query: (data) => ({
        url: RESET_PASSWORD_URL,
        method: 'PUT',
        body: data,
      }),
    }),
    updateUser: builder.mutation<IUser, IUser>({
      query: (data) => ({
        url: `${USERS_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useSignOutMutation,
  useSignUpMutation,
  useChangeUserProfileMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
