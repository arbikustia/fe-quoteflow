import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type {
  RoleCreatePayload,
  RoleCreateResponse,
  RoleData,
  RoleDetailResponse,
  RoleListParams,
  RoleListResponse,
  RoleUpdatePayload,
} from "@/modules/master-role/MasterRole.type";

/** Map API role model to UI model. */
export const mapRole = (role: RoleListResponse["data"][number]): RoleData => ({
  id: role.id,
  roleName: role.role,
  status: "active",
  createAt: role.last_created,
  createBy: null,
});

export const masterRoleService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<RoleListResponse, RoleListParams>({
      query: (params) => ({
        url: ENDPOINT.MASTER_ROLE.LIST,
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: ["Role"],
    }),
    getRoleById: builder.query<RoleDetailResponse, string>({
      query: (id) => ({
        url: `${ENDPOINT.MASTER_ROLE.DETAIL}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Role", id }],
    }),
    createRole: builder.mutation<RoleCreateResponse, RoleCreatePayload>({
      query: (body) => ({
        url: ENDPOINT.MASTER_ROLE.CREATE,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Role"],
    }),
    updateRole: builder.mutation<RoleCreateResponse, RoleUpdatePayload>({
      query: (body) => ({
        url: `${ENDPOINT.MASTER_ROLE.CREATE}/${body.id}`,
        method: "PUT",
        data: { role: body.role, status: body.status },
      }),
      invalidatesTags: ["Role"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
} = masterRoleService;
