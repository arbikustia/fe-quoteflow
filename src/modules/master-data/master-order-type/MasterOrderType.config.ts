import type { OrderTypeFlag, OrderTypeListMessageStatus, OrderTypeStatus } from "./MasterOrderType.type";

/** Order type page routes. */
export const MASTER_ORDER_TYPE_ROUTE = {
  MASTER_MAIN: "/master-main",
  LIST: "/master-order-type",
  CREATE: "/master-order-type/create",
  EDIT: "/master-order-type/edit",
} as const;

export const MASTER_ORDER_TYPE_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  SKELETON_ROW_COUNT: 5,
  SKELETON_COLUMN_WIDTHS: ["w-6", "w-48", "w-16", "w-24", "w-36", "w-10"],
} as const;

/** API status code of an active order type. */
export const ORDER_TYPE_ACTIVE_STATUS = 1;

/** API status code of an inactive order type. */
export const ORDER_TYPE_INACTIVE_STATUS = 0;

/** Placeholder rendered when an order type has no creation date. */
export const ORDER_TYPE_EMPTY_DATE_VALUE = "-";

/** Message rendered for each list state without rows. */
export const ORDER_TYPE_LIST_MESSAGE: Record<OrderTypeListMessageStatus, string> = {
  error: "Unable to load order types.",
  missing: "Order type data is unavailable. Please try again.",
  empty: "No order types found.",
};

/** Badge colors per order type status. */
export const ORDER_TYPE_STATUS_BADGE_CLASS: Record<OrderTypeStatus, string> = {
  active: "bg-success-subtle text-success-strong",
  inactive: "bg-danger-subtle text-danger-strong",
};

/** Badge colors per handover flag. */
export const ORDER_TYPE_HANDOVER_BADGE_CLASS: Record<OrderTypeFlag, string> = {
  yes: "bg-information-subtle text-information-strong",
  no: "bg-background-subtle text-text-secondary",
};

/** Readable handover label on the mobile card. */
export const ORDER_TYPE_HANDOVER_LABEL: Record<OrderTypeFlag, string> = {
  yes: "Handover Required",
  no: "No Handover",
};
