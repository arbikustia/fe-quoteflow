import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type {
  RoleAllResponse,
  RoleCreatePayload,
  RoleListParams,
  RoleListResponse,
  RoleMutationResponse,
  RoleRawResponse,
  RoleUpdatePayload,
} from "@/modules/master-data/master-role/MasterRole.type";
import { normalizeRoleResponse } from "@/modules/master-data/master-role/MasterRole.util";

import ENDPOINT from "@/constants/endpoint.constant";

export const masterRoleService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<RoleListResponse, RoleListParams>({
      query: (params) => ({
        url: ENDPOINT.MASTER_ROLE.LIST,
        method: "GET",
        params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm },
      }),
      providesTags: ["Role"],
    }),
    getAllRoles: builder.query<RoleAllResponse, void>({
      query: () => ({ url: ENDPOINT.MASTER_ROLE.ALL, method: "GET" }),
      providesTags: ["Role"],
    }),
    getRoleById: builder.query<RoleMutationResponse, string>({
      query: (id) => ({ url: `${ENDPOINT.MASTER_ROLE.DETAIL}/${id}`, method: "GET" }),
      transformResponse: (response: RoleRawResponse): RoleMutationResponse => normalizeRoleResponse(response),
      providesTags: (_result, _error, id) => [{ type: "Role", id }],
    }),
    createRole: builder.mutation<RoleMutationResponse, RoleCreatePayload>({
      query: (body) => ({ url: ENDPOINT.MASTER_ROLE.CREATE, method: "POST", data: body }),
      transformResponse: (response: RoleRawResponse): RoleMutationResponse => normalizeRoleResponse(response),
      invalidatesTags: ["Role"],
    }),
    updateRole: builder.mutation<RoleMutationResponse, RoleUpdatePayload>({
      query: ({ id, ...body }) => ({ url: `${ENDPOINT.MASTER_ROLE.DETAIL}/${id}`, method: "PUT", data: body }),
      transformResponse: (response: RoleRawResponse): RoleMutationResponse => normalizeRoleResponse(response),
      invalidatesTags: ["Role"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRolesQuery,
  useGetAllRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
} = masterRoleService;
