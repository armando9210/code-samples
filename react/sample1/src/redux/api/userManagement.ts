import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { appBaseQuery } from '../../services/query';
import { IRole } from '../../screens/Roles/types';

export const userManagementApi = createApi({
  reducerPath: 'api.userManagement',
  baseQuery: appBaseQuery({ baseUrl: '/v1/userManagement' }),
  endpoints: (build) => ({
    getProfileRoles: build.query<Entities.IGetProfileRolesResponse[], void>({
      query: () => ({ url: '/profileRoles', method: 'get' }),
    }),
    postProfileRoles: build.mutation<void, IRole>({
      query: ({ roleName, note }) =>
        ({
          url: '/profileRoles',
          method: 'POST',
          data: { roleName, note },
        })
      ,
    }),
    patchProfileRoles: build.mutation<void, IRole>({
      query: ({ roleName, note, rowNum }) =>
        ({
          url: `/profileRoles/${rowNum}`,
          method: 'PATCH',
          data: { roleName, note },
        })
      ,
    }),
    getPermissions: build.query<Entities.IPermission[], void>({
      query: () => ({ url: '/permissions', method: 'get' }),
    }),
    postRolePermissions: build.mutation<void, { rowNum: number, permissions: Entities.IPostProfileRolesByRolePayload[]  }>({
      query: ({ rowNum, permissions }) =>
        ({
          url: `/profileRoles/${rowNum}/permissions`,
          method: 'POST',
          data: permissions,
        })
      ,
    }),
  }),
});

export const { useGetProfileRolesQuery, usePostProfileRolesMutation, usePatchProfileRolesMutation, useGetPermissionsQuery, usePostRolePermissionsMutation } = userManagementApi;
