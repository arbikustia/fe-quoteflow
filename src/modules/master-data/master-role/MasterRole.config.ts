import type { RoleListMessageStatus, RoleStatus } from "./MasterRole.type";

/** Role page routes. */
export const MASTER_ROLE_ROUTE = {
  MASTER_MAIN: "/master-main",
  LIST: "/master-role",
  CREATE: "/master-role/create",
  EDIT: "/master-role/edit",
} as const;

export const MASTER_ROLE_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  SKELETON_ROW_COUNT: 5,
  SKELETON_COLUMN_WIDTHS: ["w-6", "w-40", "w-24", "w-36", "w-10"],
} as const;

/** API status code of an active role. */
export const ROLE_ACTIVE_STATUS = 1;

/** API status code of an inactive role. */
export const ROLE_INACTIVE_STATUS = 0;

/** Placeholder rendered for a missing name or creation date. */
export const ROLE_EMPTY_VALUE = "-";

/** Message rendered for each list state without rows. */
export const ROLE_LIST_MESSAGE: Record<RoleListMessageStatus, string> = {
  error: "Unable to load roles.",
  missing: "Role data is unavailable. Please try again.",
  empty: "No roles found.",
};

/** Badge colors per role status. */
export const ROLE_STATUS_BADGE_CLASS: Record<RoleStatus, string> = {
  active: "bg-success-subtle text-success-strong",
  inactive: "bg-danger-subtle text-danger-strong",
};
