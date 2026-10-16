import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";
import ENDPOINT from "@/constant/endpoint.const";
import type { ProjectCreatePayload, ProjectCreateResponse, ProjectData, ProjectListParams, ProjectListResponse } from "@/modules/master-project/MasterProject.type";

/** Map API project model to UI model. */
export const mapProject = (project: ProjectListResponse["data"][number]): ProjectData => ({
  id: project.id,
  name: project.name,
  remark: project.remark ?? "",
  status: project.status === 1 ? "active" : "inactive",
  createAt: project.created_at ?? "",
  createBy: project.created_by ?? "",
  items: [],
});

export const masterProjectService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectListResponse, ProjectListParams>({
      query: (params) => ({ url: ENDPOINT.MASTER_PROJECT.PAGED, method: "GET", params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm } }),
      providesTags: ["Project"],
    }),
    createProject: builder.mutation<ProjectCreateResponse, ProjectCreatePayload>({
      query: (body) => ({ url: ENDPOINT.MASTER_PROJECT.CREATE, method: "POST", data: body }),
      invalidatesTags: ["Project"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProjectsQuery, useCreateProjectMutation } = masterProjectService;
