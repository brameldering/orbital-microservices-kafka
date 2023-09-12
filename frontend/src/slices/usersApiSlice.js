import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constantsFrontend';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: (result, error, arg) =>
        result
          ? [...result.map(({ id }) => ({ type: 'User', id })), 'User']
          : ['User'],
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
      invalidatesTags: ['User', 'order'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/password`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
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
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
