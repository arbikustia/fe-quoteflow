import type { CategoryListMessageStatus, CategoryStatus } from "./MasterCategory.type";

/** Category page routes. */
export const MASTER_CATEGORY_ROUTE = {
  MASTER_MAIN: "/master-main",
  LIST: "/master-category",
  CREATE: "/master-category/create",
  EDIT: "/master-category/edit",
} as const;

export const MASTER_CATEGORY_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  SKELETON_ROW_COUNT: 5,
  SKELETON_COLUMN_WIDTHS: ["w-6", "w-44", "w-28", "w-32"],
} as const;

/** API status code of an active category. */
export const CATEGORY_ACTIVE_STATUS = 1;

/** API status code of an inactive category. */
export const CATEGORY_INACTIVE_STATUS = 0;

/** Placeholder rendered when a category has no creation date. */
export const CATEGORY_EMPTY_DATE_VALUE = "-";

/** Created-at display format (Indonesian long date with time). */
export const CATEGORY_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

/** Message rendered for each list state without rows. */
export const CATEGORY_LIST_MESSAGE: Record<CategoryListMessageStatus, string> = {
  error: "Unable to load categories.",
  missing: "Category data is unavailable. Please try again.",
  empty: "No categories found.",
};

/** Badge colors per category status. */
export const CATEGORY_STATUS_BADGE_CLASS: Record<CategoryStatus, string> = {
  active: "bg-success-subtle text-success-strong",
  inactive: "bg-danger-subtle text-danger-strong",
};
