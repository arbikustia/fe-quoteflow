import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type {
  RoleAllResponse,
  RoleCreatePayload,
  RoleCreateResponse,
  RoleData,
  RoleDetailResponse,
  RoleListParams,
  RoleListResponse,
  RoleUpdatePayload,
} from "@/modules/master-role/MasterRole.type";

/**
 * Map API role model to UI model.
 * @param role
 */
export const mapRole = (role: RoleListResponse["data"][number]): RoleData => ({
  id: role.id,
  roleName: role.role,
  status: role.status === 0 ? "inactive" : "active",
  createAt: role.last_created,
  createBy: null,
});

export const masterRoleService = apiRtkClient.injectEndpoints({
  /**
   *
   * @param builder
   */
  endpoints: (builder) => ({
    getRoles: builder.query<RoleListResponse, RoleListParams>({
      /**
       *
       * @param params
       */
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
    getAllRoles: builder.query<RoleAllResponse, void>({
      query: () => ({
        url: ENDPOINT.MASTER_ROLE.ALL,
        method: "GET",
      }),
      providesTags: ["Role"],
    }),
    getRoleById: builder.query<RoleDetailResponse, string>({
      /**
       *
       * @param id
       */
      query: (id) => ({
        url: `${ENDPOINT.MASTER_ROLE.DETAIL}/${id}`,
        method: "GET",
      }),
      /**
       *
       * @param _result
       * @param _error
       * @param id
       */
      providesTags: (_result, _error, id) => [{ type: "Role", id }],
    }),
    createRole: builder.mutation<RoleCreateResponse, RoleCreatePayload>({
      /**
       *
       * @param body
       */
      query: (body) => ({
        url: ENDPOINT.MASTER_ROLE.CREATE,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Role"],
    }),
    updateRole: builder.mutation<RoleCreateResponse, RoleUpdatePayload>({
      /**
       *
       * @param body
       */
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
  useGetAllRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
} = masterRoleService;
