import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";
import ENDPOINT from "@/constant/endpoint.const";
import type { RoleCreatePayload, RoleCreateResponse, RoleData, RoleListParams, RoleListResponse } from "@/modules/master-role/MasterRole.type";

/** Map API role model to UI model. */
export const mapRole = (role: RoleListResponse["data"][number]): RoleData => ({
  id: role.id,
  roleName: role.role,
  status: "active",
  createAt: role.last_created ?? "",
  createBy: "",
});

export const masterRoleService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<RoleListResponse, RoleListParams>({ query: (params) => ({ url: ENDPOINT.MASTER_ROLE.LIST, method: "GET", params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm } }), providesTags: ["Role"] }),
    createRole: builder.mutation<RoleCreateResponse, RoleCreatePayload>({ query: (body) => ({ url: ENDPOINT.MASTER_ROLE.CREATE, method: "POST", data: body }), invalidatesTags: ["Role"] }),
  }),
  overrideExisting: false,
});

export const { useGetRolesQuery, useCreateRoleMutation } = masterRoleService;
