import type { PaymentMethodListMessageStatus, PaymentMethodStatus } from "./MasterPaymentMethod.type";

/** Payment method page routes. */
export const MASTER_PAYMENT_METHOD_ROUTE = {
  MASTER_MAIN: "/master-main",
  LIST: "/master-payment-method",
  CREATE: "/master-payment-method/create",
  EDIT: "/master-payment-method/edit",
} as const;

export const MASTER_PAYMENT_METHOD_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  SKELETON_ROW_COUNT: 5,
  SKELETON_COLUMN_WIDTHS: ["w-6", "w-40", "w-56", "w-24", "w-36", "w-10"],
} as const;

/** API status code of an active payment method. */
export const PAYMENT_METHOD_ACTIVE_STATUS = 1;

/** API status code of an inactive payment method. */
export const PAYMENT_METHOD_INACTIVE_STATUS = 0;

/** Placeholder rendered for a missing name or creation date. */
export const PAYMENT_METHOD_EMPTY_VALUE = "-";

/** Placeholder rendered for a missing description. */
export const PAYMENT_METHOD_EMPTY_DESCRIPTION = "No description";

/** Message rendered for each list state without rows. */
export const PAYMENT_METHOD_LIST_MESSAGE: Record<PaymentMethodListMessageStatus, string> = {
  error: "Unable to load payment methods.",
  missing: "Payment method data is unavailable. Please try again.",
  empty: "No payment methods found.",
};

/** Badge colors per payment method status. */
export const PAYMENT_METHOD_STATUS_BADGE_CLASS: Record<PaymentMethodStatus, string> = {
  active: "bg-success-subtle text-success-strong",
  inactive: "bg-danger-subtle text-danger-strong",
};
