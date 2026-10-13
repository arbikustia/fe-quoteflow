import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type {
  RoleCreatePayload,
  RoleCreateResponse,
  RoleData,
  RoleListParams,
  RoleListResponse,
} from "./MasterRole.type";

/**
 * Map API role model to RoleData UI model.
 * @param {RoleListResponse["data"][number]} role - Raw API role object
 * @returns {RoleData} Mapped role model
 */
export const _mapRole = (role: RoleListResponse["data"][number]): RoleData => ({
  id: role.id,
  roleName: role.role,
  status: "active",
  createAt: role.last_created ?? "",
  createBy: "",
});

export const masterRoleApi = apiRtkClient.injectEndpoints({
  /**
   * Define endpoints for master role API
   * @param {object} builder - RTK Query endpoint builder
   * @returns {object} Endpoint definitions
   */
  endpoints: (builder) => ({
    /**
     * GET /api/role/paged - Fetch paginated roles
     * @param {RoleListParams} params - Query parameters
     * @returns {Promise<RoleListResponse>} Paginated role list
     */
    getRoles: builder.query<RoleListResponse, RoleListParams>({
      /**
       * Configure the query for fetching roles
       * @param {RoleListParams} params - Query parameters
       * @returns {object} RTK Query configuration
       */
      query: (params) => ({
        url: "/api/role/list-role",
        method: "GET",
        params: {
          page_number: params.pageNumber,
          page_size: params.pageSize,
          search_term: params.searchTerm,
        },
      }),
      providesTags: ["Role"],
    }),
    /**
     * POST /api/role - Create a new role
     * @param {RoleCreatePayload} body - Role creation payload
     * @returns {Promise<RoleCreateResponse>} Created role response
     */
    createRole: builder.mutation<RoleCreateResponse, RoleCreatePayload>({
      /**
       * Configure the mutation for creating a role
       * @param {RoleCreatePayload} body - Role creation payload
       * @returns {object} RTK Query configuration
       */
      query: (body) => ({
        url: "/api/role",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Role"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetRolesQuery, useCreateRoleMutation } = masterRoleApi;
