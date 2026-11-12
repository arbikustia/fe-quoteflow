import type { ProjectListMessageStatus, ProjectStatus } from "./MasterProject.type";

/** Project page routes. */
export const MASTER_PROJECT_ROUTE = {
  MASTER_MAIN: "/master-main",
  LIST: "/master-project",
  CREATE: "/master-project/create",
  EDIT: "/master-project/edit",
} as const;

export const MASTER_PROJECT_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  SKELETON_ROW_COUNT: 5,
  SKELETON_COLUMN_WIDTHS: ["w-6", "w-44", "w-32", "w-24", "w-36", "w-10"],
} as const;

/** API status code of an active project. */
export const PROJECT_ACTIVE_STATUS = 1;

/** API status code of an inactive project. */
export const PROJECT_INACTIVE_STATUS = 0;

/** Placeholder rendered for a missing remark or date. */
export const PROJECT_EMPTY_VALUE = "-";

/** Message rendered for each list state without rows. */
export const PROJECT_LIST_MESSAGE: Record<ProjectListMessageStatus, string> = {
  error: "Unable to load projects.",
  missing: "Project data is unavailable. Please try again.",
  empty: "No projects found.",
};

/** Badge colors per project status. */
export const PROJECT_STATUS_BADGE_CLASS: Record<ProjectStatus, string> = {
  active: "bg-success-subtle text-success-strong",
  inactive: "bg-danger-subtle text-danger-strong",
};
