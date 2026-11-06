import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type { ApiBaseData, ApiBaseItem } from "@/types/api.type";

import ENDPOINT from "@/constants/endpoint.constant";
import type {
  RoleAllResponse,
  RoleCreatePayload,
  RoleCreateResponse,
  RoleData,
  RoleDetailResponse,
  RoleListParams,
  RoleListResponse,
  RoleUpdatePayload,
} from "@/modules/master-data/master-role/MasterRole.type";

/**
 * Map API role model to UI model.
 * @param role
 */
export const mapRole = (role: RoleListResponse["data"][number]): RoleData => ({
  id: role.id,
  roleName: role.role,
  status: role.status === 0 ? "inactive" : "active",
  ...(role.last_created ? { createAt: role.last_created } : {}),
});

/**
 * Normalize role detail API variants at service boundary.
 * @param {RoleDetailApiResponse} response - Raw role detail response
 * @returns {RoleDetailResponse} Normalized role detail response
 */
export const normalizeRoleDetailResponse = (
  response: ApiBaseData,
): RoleDetailResponse => {
  const data: ApiBaseItem | undefined = Array.isArray(response.data)
    ? response.data[0]
    : response.data ?? undefined;
  let messages: string[] = [];

  if (Array.isArray(response.messages)) {
    messages = response.messages;
  } else if (response.messages) {
    messages = [response.messages];
  }
  const role = data?.id && data.role && data.status !== undefined
    ? {
        id: data.id,
        role: data.role,
        status: data.status,
        ...(data.last_created ? { last_created: data.last_created } : {}),
      }
    : undefined;

  return {
    status: response.status,
    ...(role ? { data: role } : {}),
    messages,
  };
};

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
      transformResponse: normalizeRoleDetailResponse,
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
      transformResponse: normalizeRoleDetailResponse,
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
      transformResponse: normalizeRoleDetailResponse,
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
