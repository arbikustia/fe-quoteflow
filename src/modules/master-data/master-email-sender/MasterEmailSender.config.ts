import type { EmailSenderFlag, EmailSenderListMessageStatus, EmailSenderStatus } from "./MasterEmailSender.type";

/** Email sender page routes. */
export const MASTER_EMAIL_SENDER_ROUTE = {
  MASTER_MAIN: "/master-main",
  LIST: "/master-email-sender",
  CREATE: "/master-email-sender/create",
  EDIT: "/master-email-sender/edit",
} as const;

export const MASTER_EMAIL_SENDER_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  SKELETON_ROW_COUNT: 5,
  SKELETON_COLUMN_WIDTHS: ["w-6", "w-40", "w-48", "w-36", "w-16", "w-16", "w-28", "w-36"],
} as const;

/** API status code of an active sender. */
export const EMAIL_SENDER_ACTIVE_STATUS = 1;

/** API status code of an inactive sender. */
export const EMAIL_SENDER_INACTIVE_STATUS = 0;

/** Placeholder rendered when a sender has no creation date. */
export const EMAIL_SENDER_EMPTY_DATE_VALUE = "-";

/** Message rendered for each list state without rows. */
export const EMAIL_SENDER_LIST_MESSAGE: Record<EmailSenderListMessageStatus, string> = {
  error: "Unable to load email senders.",
  missing: "Email sender data is unavailable. Please try again.",
  empty: "No email senders found.",
};

/** Badge colors per sender status. */
export const EMAIL_SENDER_STATUS_BADGE_CLASS: Record<EmailSenderStatus, string> = {
  active: "bg-success-subtle text-success-strong",
  inactive: "bg-danger-subtle text-danger-strong",
};

/** Badge colors per yes / no flag (SSL, default sender). */
export const EMAIL_SENDER_FLAG_BADGE_CLASS: Record<EmailSenderFlag, string> = {
  yes: "bg-information-subtle text-information-strong",
  no: "bg-background-subtle text-text-secondary",
};

/** Readable label per yes / no flag. */
export const EMAIL_SENDER_FLAG_LABEL: Record<EmailSenderFlag, string> = {
  yes: "Yes",
  no: "No",
};
