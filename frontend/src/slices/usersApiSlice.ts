import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constantsFrontend';
import {
  IUser,
  IRegistration,
  ILogin,
  IPasswordUpdate,
  IPasswordReset,
} from '../types/userTypes';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<IUser[], void>({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'User' as const, id: _id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    register: builder.mutation<IUser, IRegistration>({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    login: builder.mutation<IUser, ILogin>({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Order'],
    }),
    updateProfile: builder.mutation<IUser, IUser>({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { _id }) => {
        if (error) {
          return [];
        }
        // Invalidate the cache for the specific user
        return [{ type: 'User', id: _id }];
      },
    }),
    updatePassword: builder.mutation<IUser, IPasswordUpdate>({
      query: (data) => ({
        url: `${USERS_URL}/updatepassword`,
        method: 'PUT',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<void, IPasswordReset>({
      query: (data) => ({
        url: `${USERS_URL}/resetpassword`,
        method: 'PUT',
        body: data,
      }),
    }),
    getUserDetails: builder.query<IUser, string>({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation<IUser, IUser>({
      query: (data) => ({
        url: `${USERS_URL}/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { _id }) => {
        if (error) {
          return [];
        }
        // Invalidate the cache for the specific user
        return [{ type: 'User', id: _id }];
      },
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
  useGetUsersQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useResetPasswordMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
