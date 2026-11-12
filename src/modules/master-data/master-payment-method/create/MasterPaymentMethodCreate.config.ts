import type { PaymentMethodFormMode, PaymentMethodFormModeText, PaymentMethodFormStatus, PaymentMethodFormValues } from "./MasterPaymentMethodCreate.type";

export const PAYMENT_METHOD_FORM_MESSAGE = {
  NAME_REQUIRED: "Payment method name is required.",
  DESCRIPTION_REQUIRED: "Description is required.",
  REQUEST_FAILED: "Payment method request failed.",
} as const;

/** Values of an empty create form. */
export const PAYMENT_METHOD_FORM_DEFAULT_VALUES: PaymentMethodFormValues = {
  name: "",
  description: "",
  isActive: true,
};

/** Copy per form mode. */
export const PAYMENT_METHOD_FORM_MODE_TEXT: Record<PaymentMethodFormMode, PaymentMethodFormModeText> = {
  create: {
    title: "New Payment Method",
    subtitle: "Create a payment method for transactions.",
    submitLabel: "Create Payment Method",
    submittingLabel: "Creating…",
    successMessage: "Payment method created successfully.",
    failureMessage: "Unable to create payment method. Please try again.",
  },
  edit: {
    title: "Edit Payment Method",
    subtitle: "Update payment method information.",
    submitLabel: "Update Payment Method",
    submittingLabel: "Updating…",
    successMessage: "Payment method updated successfully.",
    failureMessage: "Unable to update payment method. Please try again.",
  },
};

/** Message shown in place of the form while it cannot be edited. */
export const PAYMENT_METHOD_FORM_STATUS_MESSAGE: Record<Exclude<PaymentMethodFormStatus, "ready">, string> = {
  error: "Payment method data is unavailable. Open the payment method from the payment method list to edit it.",
};
