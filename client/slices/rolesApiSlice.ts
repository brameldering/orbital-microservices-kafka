import { ROLES_URL, IRole, IRoleCreate } from '@orbitelco/common';

import apiSlice from './apiSlice';

export const rolesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRole: builder.mutation<IRole, IRoleCreate>({
      query: (data) => ({
        url: ROLES_URL,
        method: 'POST',
        body: data,
      }),
    }),
    getRoleById: builder.query<IRole, string>({
      query: (id) => ({
        url: `${ROLES_URL}/${id}`,
      }),
    }),
    updateRole: builder.mutation<IRole, IRole>({
      query: (data) => ({
        url: `${ROLES_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `${ROLES_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreateRoleMutation,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesApiSlice;
