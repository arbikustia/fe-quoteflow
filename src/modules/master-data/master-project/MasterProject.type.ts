import type { ChangeEvent } from "react";
import { z } from "zod";

import { formatIndonesianDateTime } from "@/utils/date.helpers";

import type { ApiEnvelope, PaginatedResponse } from "@/types/api.type";

import { PROJECT_ACTIVE_STATUS, PROJECT_EMPTY_VALUE } from "./MasterProject.config";

/** Project status as shown in the UI. */
export type ProjectStatus = "active" | "inactive";

/** API status code (`1` = active) mapped to the UI status. */
export const ProjectStatusSchema = z
  .number()
  .catch(0)
  .transform((status): ProjectStatus => (status === PROJECT_ACTIVE_STATUS ? "active" : "inactive"));

/** API timestamp formatted for display, with a placeholder when absent. */
export const ProjectDateSchema = z
  .string()
  .nullish()
  .transform((value): string => (value ? formatIndonesianDateTime(value) : PROJECT_EMPTY_VALUE));

/** Raw project item record nested in a project response. */
export const ApiProjectItemSchema = z.object({
  id: z.string(),
  item_id: z.string(),
  item_name: z.string().nullable(),
  qty: z.number(),
  price: z.number(),
  status: z.number(),
});

/** Raw project item record as returned by the API. */
export type ApiProjectItem = z.input<typeof ApiProjectItemSchema>;

/** Raw project record as returned by `GET /api/project`, `/api/project/paged` and `/api/project/{id}`. */
export const ApiProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  remark: z.string().nullable(),
  price: z.number(),
  status: z.number(),
  created_at: z.string().nullable(),
  created_by: z.string().nullable(),
  items: z.array(ApiProjectItemSchema).nullish(),
});

/** Raw project record as returned by the API (also consumed by the order modules). */
export type ApiProject = z.input<typeof ApiProjectSchema>;

/** Project row normalized for the list view. */
export const ProjectListItemSchema = ApiProjectSchema.transform((project) => ({
  id: project.id,
  name: project.name,
  remark: project.remark || PROJECT_EMPTY_VALUE,
  status: ProjectStatusSchema.parse(project.status),
  createdAt: ProjectDateSchema.parse(project.created_at),
  itemCount: project.items?.length ?? 0,
}));

/** Project row ready for the list view. */
export type ProjectData = z.output<typeof ProjectListItemSchema>;

/** Paged project list response. */
export type ProjectListResponse = PaginatedResponse<ApiProject>;

/** All-projects response used by the order modules. */
export type ProjectAllResponse = ApiEnvelope<ApiProject[]>;

/** Single project response of the detail, create and update endpoints. */
export type ProjectDetailResponse = ApiEnvelope<ApiProject | null>;

/** Project item in a create / update request body. */
export type ProjectItemPayload = {
  item_id: string;
  qty: number;
  price: number;
};

/** Create Project request body. */
export type ProjectCreatePayload = {
  name: string;
  remark: string;
  price: number;
  status: number;
  items: ProjectItemPayload[];
};

/** Update Project request body. */
export type ProjectUpdatePayload = ProjectCreatePayload & {
  id: string;
};

/** Paged project list query params. */
export type ProjectListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

/** Which part of the list view is rendered. */
export type ProjectListStatus = "loading" | "error" | "missing" | "empty" | "ready";

/** List statuses that render a message instead of rows. */
export type ProjectListMessageStatus = Exclude<ProjectListStatus, "loading" | "ready">;

/** Normalized paged list data. */
export type ProjectListView = {
  listStatus: ProjectListStatus;
  projects: ProjectData[];
  totalPages: number;
  totalCount: number;
};

/** Raw RTK Query state consumed by the list normalizer. */
export type ProjectListQueryState = {
  data?: ProjectListResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Router state the list page receives after a create / update. */
export type ProjectRouteState = {
  successMessage?: string;
} | null;

/** Paging and search state of the project list. */
export type ProjectListPaging = {
  queryParams: ProjectListParams;
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/** Navigation handlers of the project list. */
export type ProjectNavigation = {
  handleBack: () => void;
  handleCreate: () => void;
  handleEdit: (project: ProjectData) => void;
};

/** Project list state and handlers owned by the module hook. */
export type MasterProjectController = ProjectListPaging & ProjectNavigation;

/** Props of the project mobile card. */
export type ProjectMobileCardProps = {
  project: ProjectData;
  canEdit: boolean;
  onEdit: (project: ProjectData) => void;
};

/** Props of the project list view. */
export type MasterProjectProps = ProjectListView & {
  currentPage: number;
  pageSize: number;
  canCreate: boolean;
  canEdit: boolean;
  successMessage?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onCreate: () => void;
  onEdit: (project: ProjectData) => void;
};
