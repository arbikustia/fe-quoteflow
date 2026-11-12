import type { VoucherListMessageStatus, VoucherStatus } from "./MasterVoucher.type";

/** Voucher page routes. */
export const MASTER_VOUCHER_ROUTE = {
  MASTER_MAIN: "/master-main",
  LIST: "/master-voucher",
  CREATE: "/master-voucher/create",
  EDIT: "/master-voucher/edit",
} as const;

export const MASTER_VOUCHER_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  SKELETON_ROW_COUNT: 5,
  SKELETON_COLUMN_WIDTHS: ["w-6", "w-40", "w-32", "w-16", "w-24", "w-36", "w-10"],
} as const;

/** API status code of an active voucher. */
export const VOUCHER_ACTIVE_STATUS = 1;

/** API status code of an inactive voucher. */
export const VOUCHER_INACTIVE_STATUS = 0;

/** Placeholder rendered for a missing name or creation date. */
export const VOUCHER_EMPTY_VALUE = "-";

/** Message rendered for each list state without rows. */
export const VOUCHER_LIST_MESSAGE: Record<VoucherListMessageStatus, string> = {
  error: "Unable to load vouchers.",
  missing: "Voucher data is unavailable. Please try again.",
  empty: "No vouchers found.",
};

/** Badge colors per voucher status. */
export const VOUCHER_STATUS_BADGE_CLASS: Record<VoucherStatus, string> = {
  active: "bg-success-subtle text-success-strong",
  inactive: "bg-danger-subtle text-danger-strong",
};

/** Alert shown when the voucher image cannot be generated. */
export const VOUCHER_DOWNLOAD_FAILED_MESSAGE = "Unable to download voucher template.";

/** Canvas size and colors of the downloadable voucher image. */
export const VOUCHER_IMAGE = {
  WIDTH: 1600,
  HEIGHT: 800,
  JPEG_QUALITY: 0.95,
  PALE_BLUE: "#F4F8FD",
  NAVY: "#082F5D",
  ORANGE: "#FF8A00",
  CODE_ORANGE: "#F04416",
  WHITE: "#FFFFFF",
  CODE_FONT_SIZE: 86,
} as const;
