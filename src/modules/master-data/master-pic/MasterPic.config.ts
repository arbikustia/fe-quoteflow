import type { PicListMessageStatus, PicStatus } from "./MasterPic.type";

/** PIC page routes. */
export const MASTER_PIC_ROUTE = {
  MASTER_MAIN: "/master-main",
  LIST: "/master-pic",
  CREATE: "/master-pic/create",
  EDIT: "/master-pic/edit",
} as const;

export const MASTER_PIC_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  SKELETON_ROW_COUNT: 5,
  SKELETON_COLUMN_WIDTHS: ["w-6", "w-48", "w-24", "w-36", "w-10"],
} as const;

/** API status code of an active PIC. */
export const PIC_ACTIVE_STATUS = 1;

/** API status code of an inactive PIC. */
export const PIC_INACTIVE_STATUS = 0;

/** Placeholder rendered for a missing name or creation date. */
export const PIC_EMPTY_VALUE = "-";

/** Message rendered for each list state without rows. */
export const PIC_LIST_MESSAGE: Record<PicListMessageStatus, string> = {
  error: "Unable to load PICs.",
  missing: "PIC data is unavailable. Please try again.",
  empty: "No PICs found.",
};

/** Badge colors per PIC status. */
export const PIC_STATUS_BADGE_CLASS: Record<PicStatus, string> = {
  active: "bg-success-subtle text-success-strong",
  inactive: "bg-danger-subtle text-danger-strong",
};
