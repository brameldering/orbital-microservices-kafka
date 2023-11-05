import {
  USERS_URL,
  SIGN_UP_URL,
  SIGN_IN_URL,
  SIGN_OUT_URL,
  CURRENT_USER_URL,
  RESET_PASSWORD_URL,
  UPDATE_PASSWORD_URL,
  UPDATE_PROFILE_URL,
} from '@orbitelco/common';

import {
  ICurrentUser,
  IUser,
  ISignUp,
  ISignIn,
  IChangeUserProfile,
  IChangePassword,
  IResetPassword,
} from '../types/user-types';

import apiSlice from './apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<ICurrentUser, void>({
      query: () => ({
        url: CURRENT_USER_URL,
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
      invalidatesTags: ['User', 'Order'],
    }),
    signUp: builder.mutation<IUser, ISignUp>({
      query: (data) => ({
        url: SIGN_UP_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getUsers: builder.query<IUser[], void>({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User'],
    }),
    changeUserProfile: builder.mutation<IUser, IChangeUserProfile>({
      query: (data) => ({
        url: UPDATE_PROFILE_URL,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation<IUser, IChangePassword>({
      query: (data) => ({
        url: UPDATE_PASSWORD_URL,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    resetPassword: builder.mutation<void, IResetPassword>({
      query: (data) => ({
        url: RESET_PASSWORD_URL,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getUserById: builder.query<IUser, string>({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation<IUser, IUser>({
      query: (data) => ({
        url: `${USERS_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useSignInMutation,
  useSignOutMutation,
  useSignUpMutation,
  useGetUsersQuery,
  useChangeUserProfileMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
