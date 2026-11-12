import type { CustomerListMessageStatus, CustomerStatus } from "./MasterCustomer.type";

/** Customer page routes. */
export const MASTER_CUSTOMER_ROUTE = {
  MASTER_MAIN: "/master-main",
  LIST: "/master-customer",
  CREATE: "/master-customer/create",
  EDIT: "/master-customer/edit",
} as const;

export const MASTER_CUSTOMER_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  SKELETON_ROW_COUNT: 5,
  SKELETON_COLUMN_WIDTHS: ["w-6", "w-36", "w-44", "w-44", "w-32", "w-28"],
} as const;

/** API status code of an active customer. */
export const CUSTOMER_ACTIVE_STATUS = 1;

/** API status code of an inactive customer. */
export const CUSTOMER_INACTIVE_STATUS = 0;

/** Placeholder rendered for empty optional customer fields. */
export const CUSTOMER_EMPTY_DISPLAY_VALUE = "—";

/** Message rendered for each list state without rows. */
export const CUSTOMER_LIST_MESSAGE: Record<CustomerListMessageStatus, string> = {
  error: "Unable to load customers.",
  missing: "Customer data is unavailable. Please try again.",
  empty: "No customers found.",
};

/** Badge colors per customer status. */
export const CUSTOMER_STATUS_BADGE_CLASS: Record<CustomerStatus, string> = {
  active: "bg-success-subtle text-success-strong",
  inactive: "bg-danger-subtle text-danger-strong",
};
