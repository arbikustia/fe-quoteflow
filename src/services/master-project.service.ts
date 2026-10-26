import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type { ProjectAllResponse, ProjectCreatePayload, ProjectCreateResponse, ProjectData, ProjectDetailResponse, ProjectListParams, ProjectListResponse, ProjectUpdatePayload, ProjectUpdateResponse } from "@/modules/master-project/MasterProject.type";

/**
 * Map API project model to UI model.
 * @param project
 */
export const mapProject = (project: ProjectListResponse["data"][number]): ProjectData => ({
  id: project.id,
  name: project.name,
  remark: project.remark ?? "",
  status: project.status === 1 ? "active" : "inactive",
  createAt: project.created_at ?? "",
  createBy: project.created_by ?? "",
  items: (project.items ?? []).map((item) => ({ item_id: item.item_id, item_name: item.item_name, qty: item.qty })),
});

export const masterProjectService = apiRtkClient.injectEndpoints({
  /**
   *
   * @param builder
   */
  endpoints: (builder) => ({
    getAllProjects: builder.query<ProjectAllResponse, void>({
      query: () => ({ url: ENDPOINT.MASTER_PROJECT.ALL, method: "GET" }),
      providesTags: ["Project"],
    }),
    getProjects: builder.query<ProjectListResponse, ProjectListParams>({
      /**
       *
       * @param params
       */
      query: (params) => ({ url: ENDPOINT.MASTER_PROJECT.PAGED, method: "GET", params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm } }),
      providesTags: ["Project"],
    }),
    getProjectById: builder.query<ProjectDetailResponse, string>({
      /**
       * Fetch one project with item records.
       * @param id Project ID
       */
      query: (id) => ({ url: `${ENDPOINT.MASTER_PROJECT.DETAIL}/${id}`, method: "GET" }),
      providesTags: ["Project"],
    }),
    updateProject: builder.mutation<ProjectUpdateResponse, ProjectUpdatePayload>({
      /**
       * Update project and selected items.
       * @param payload Project ID and request data
       */
      query: ({ id, ...body }) => ({ url: `${ENDPOINT.MASTER_PROJECT.DETAIL}/${id}`, method: "PUT", data: body }),
      invalidatesTags: ["Project"],
    }),
    createProject: builder.mutation<ProjectCreateResponse, ProjectCreatePayload>({
      /**
       *
       * @param body
       */
      query: (body) => ({ url: ENDPOINT.MASTER_PROJECT.CREATE, method: "POST", data: body }),
      invalidatesTags: ["Project"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllProjectsQuery, useGetProjectsQuery, useGetProjectByIdQuery, useLazyGetProjectByIdQuery, useCreateProjectMutation, useUpdateProjectMutation } = masterProjectService;
