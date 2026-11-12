import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type {
  ProjectAllResponse,
  ProjectCreatePayload,
  ProjectDetailResponse,
  ProjectListParams,
  ProjectListResponse,
  ProjectUpdatePayload,
} from "@/modules/master-data/master-project/MasterProject.type";

import ENDPOINT from "@/constants/endpoint.constant";

export const masterProjectService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjects: builder.query<ProjectAllResponse, void>({
      query: () => ({ url: ENDPOINT.MASTER_PROJECT.ALL, method: "GET" }),
      providesTags: ["Project"],
    }),
    getProjects: builder.query<ProjectListResponse, ProjectListParams>({
      query: (params) => ({
        url: ENDPOINT.MASTER_PROJECT.PAGED,
        method: "GET",
        params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm },
      }),
      providesTags: ["Project"],
    }),
    getProjectById: builder.query<ProjectDetailResponse, string>({
      query: (id) => ({ url: `${ENDPOINT.MASTER_PROJECT.DETAIL}/${id}`, method: "GET" }),
      providesTags: ["Project"],
    }),
    createProject: builder.mutation<ProjectDetailResponse, ProjectCreatePayload>({
      query: (body) => ({ url: ENDPOINT.MASTER_PROJECT.CREATE, method: "POST", data: body }),
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation<ProjectDetailResponse, ProjectUpdatePayload>({
      query: ({ id, ...body }) => ({ url: `${ENDPOINT.MASTER_PROJECT.DETAIL}/${id}`, method: "PUT", data: body }),
      invalidatesTags: ["Project"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllProjectsQuery,
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
} = masterProjectService;
