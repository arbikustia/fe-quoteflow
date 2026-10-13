import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type {
  ProjectCreatePayload,
  ProjectCreateResponse,
  ProjectData,
  ProjectListParams,
  ProjectListResponse,
} from "./MasterProject.type";

/**
 * Map API project model to ProjectData UI model.
 * @param {ProjectListResponse["data"][number]} project - Raw API project object
 * @returns {ProjectData} Mapped project model
 */
export const _mapProject = (
  project: ProjectListResponse["data"][number],
): ProjectData => ({
  id: project.id,
  name: project.name,
  remark: project.remark ?? "",
  status: project.status === 1 ? "active" : "inactive",
  createAt: project.created_at ?? "",
  createBy: project.created_by ?? "",
  items: [],
});

export const masterProjectApi = apiRtkClient.injectEndpoints({
  /**
   * Define endpoints for master project API
   * @param {object} builder - RTK Query endpoint builder
   * @returns {object} Endpoint definitions
   */
  endpoints: (builder) => ({
    /**
     * GET /api/project/paged - Fetch paginated projects
     * @param {ProjectListParams} params - Query parameters
     * @returns {Promise<ProjectListResponse>} Paginated project list
     */
    getProjects: builder.query<ProjectListResponse, ProjectListParams>({
      /**
       * Configure the query for fetching projects
       * @param {ProjectListParams} params - Query parameters
       * @returns {object} RTK Query configuration
       */
      query: (params) => ({
        url: "/api/project/paged",
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: ["Project"],
    }),
    /**
     * POST /api/project - Create a new project
     * @param {ProjectCreatePayload} body - Project creation payload
     * @returns {Promise<ProjectCreateResponse>} Created project response
     */
    createProject: builder.mutation<ProjectCreateResponse, ProjectCreatePayload>({
      /**
       * Configure the mutation for creating a project
       * @param {ProjectCreatePayload} body - Project creation payload
       * @returns {object} RTK Query configuration
       */
      query: (body) => ({
        url: "/api/project",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Project"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProjectsQuery, useCreateProjectMutation } = masterProjectApi;
