import type { UserListMessageStatus, UserStatus } from "./MasterUser.type";

/** User page routes. */
export const MASTER_USER_ROUTE = {
  MASTER_MAIN: "/master-main",
  LIST: "/master-user",
  CREATE: "/master-user/create",
  EDIT: "/master-user/edit",
} as const;

export const MASTER_USER_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  SKELETON_ROW_COUNT: 5,
  SKELETON_COLUMN_WIDTHS: ["w-6", "w-36", "w-48", "w-24", "w-24", "w-36", "w-10"],
} as const;

/** API status code of an active user. */
export const USER_ACTIVE_STATUS = 1;

/** API status code of an inactive user. */
export const USER_INACTIVE_STATUS = 0;

/** Placeholder rendered for a missing value. */
export const USER_EMPTY_VALUE = "-";

/** Message rendered for each list state without rows. */
export const USER_LIST_MESSAGE: Record<UserListMessageStatus, string> = {
  error: "Unable to load users.",
  missing: "User data is unavailable. Please try again.",
  empty: "No users found.",
};

/** Badge colors per user status. */
export const USER_STATUS_BADGE_CLASS: Record<UserStatus, string> = {
  active: "bg-success-subtle text-success-strong",
  inactive: "bg-danger-subtle text-danger-strong",
};
