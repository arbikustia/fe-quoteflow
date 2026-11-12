import type { VoucherCodeMode, VoucherFormMode, VoucherFormModeText, VoucherFormStatus, VoucherFormValues } from "./MasterVoucherCreate.type";

/** Validation and request messages of the voucher form. */
export const VOUCHER_FORM_MESSAGE = {
  NAME_REQUIRED: "Voucher name is required.",
  DISCOUNT_REQUIRED: "Discount percentage is required.",
  DISCOUNT_RANGE: "Discount must be between 0 and 100.",
  CODE_REQUIRED: "Voucher code is required.",
  CODE_INVALID: "Voucher code must be 7 to 8 alphanumeric characters.",
  REQUEST_FAILED: "Voucher request failed.",
} as const;

/** Values of an empty create form. */
export const VOUCHER_FORM_DEFAULT_VALUES: VoucherFormValues = {
  name: "",
  codeMode: "generate",
  code: "",
  discountPercent: null,
  isActive: true,
};

/** Rules of generated and typed voucher codes. */
export const VOUCHER_CODE_RULE = {
  CHARSET: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  PREFIX: "SL",
  RANDOM_LENGTH: 6,
  PATTERN: /^[A-Za-z0-9]{7,8}$/,
} as const;

/** Discount bounds in percent. */
export const VOUCHER_DISCOUNT_RANGE = { MIN: 0, MAX: 100 } as const;

/** Options of the code mode select. */
export const VOUCHER_CODE_MODE_OPTIONS: { label: string; value: VoucherCodeMode }[] = [
  { label: "Generate Code", value: "generate" },
  { label: "Type Code", value: "type" },
];

/** Copy per form mode. */
export const VOUCHER_FORM_MODE_TEXT: Record<VoucherFormMode, VoucherFormModeText> = {
  create: {
    title: "New Voucher",
    subtitle: "Fill in the voucher details below.",
    submitLabel: "Create Voucher",
    submittingLabel: "Creating…",
    successMessage: "Voucher created successfully.",
    failureMessage: "Unable to create voucher. Please try again.",
  },
  edit: {
    title: "Edit Voucher",
    subtitle: "Update the voucher details below.",
    submitLabel: "Update Voucher",
    submittingLabel: "Updating…",
    successMessage: "Voucher updated successfully.",
    failureMessage: "Unable to update voucher. Please try again.",
  },
};

/** Message shown in place of the form while it cannot be edited. */
export const VOUCHER_FORM_STATUS_MESSAGE: Record<Exclude<VoucherFormStatus, "ready">, string> = {
  loading: "Loading voucher data…",
  error: "Unable to load voucher data. Please try again.",
};
