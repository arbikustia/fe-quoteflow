import type { ItemDownloadFormat, ItemListMessageStatus, ItemStatus } from "./MasterItem.type";

/** Item page routes. */
export const MASTER_ITEM_ROUTE = {
  MASTER_MAIN: "/master-main",
  LIST: "/master-item",
  CREATE: "/master-item/create",
  EDIT: "/master-item/edit",
} as const;

export const MASTER_ITEM_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  SKELETON_ROW_COUNT: 5,
  SKELETON_COLUMNS: [{ width: "5%" }, { width: "35%" }, { width: "20%" }, { width: "20%" }, { width: "20%" }],
} as const;

/** API status code of an active item. */
export const ITEM_ACTIVE_STATUS = 1;

/** API status code of an inactive item. */
export const ITEM_INACTIVE_STATUS = 0;

/** Placeholder rendered for an empty optional value. */
export const ITEM_EMPTY_VALUE = "-";

/** Message rendered for each list state without rows. */
export const ITEM_LIST_MESSAGE: Record<ItemListMessageStatus, string> = {
  error: "Unable to load items.",
  missing: "Item data is unavailable. Please try again.",
  empty: "No items found.",
};

/** Badge colors per item status. */
export const ITEM_STATUS_BADGE_CLASS: Record<ItemStatus, string> = {
  active: "bg-success-subtle text-success-strong",
  inactive: "bg-danger-subtle text-danger-strong",
};

/** Label per QR download format. */
export const ITEM_DOWNLOAD_LABEL: Record<ItemDownloadFormat, string> = {
  image: "Download Image",
  pdf: "Download PDF",
};

/** QR label layout, in millimetres unless noted. */
export const ITEM_QR_LABEL = {
  MIN_WIDTH_MM: 33,
  HEIGHT_MM: 15,
  QR_SIZE_MM: 13,
  HORIZONTAL_PADDING_MM: 1,
  VERTICAL_PADDING_MM: 1,
  QR_TEXT_GAP_MM: 1,
  NAME_BASELINE_MM: 4.5,
  CATEGORY_BASELINE_MM: 8.5,
  FONT_SIZE_PT: 6,
  PIXELS_PER_POINT_AT_EXPORT_SCALE: 3.528,
  IMAGE_SCALE: 10,
  IMAGE_QUALITY: 0.95,
  PAGE_MARGIN_MM: 15,
  LABEL_GAP_MM: 2,
  PDF_FILE_NAME: "qr-items.pdf",
} as const;
