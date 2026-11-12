import type {
  OrderTypeFormMode,
  OrderTypeFormModeText,
  OrderTypeFormStatus,
  OrderTypeFormValues,
} from "./MasterOrderTypeCreate.type";

export const ORDER_TYPE_FORM_MESSAGE = {
  NAME_REQUIRED: "Order type name is required.",
  REQUEST_FAILED: "Order type request failed.",
} as const;

/** Values of an empty create form. */
export const ORDER_TYPE_FORM_DEFAULT_VALUES: OrderTypeFormValues = {
  name: "",
  isHandover: false,
  isActive: true,
};

/** Copy per form mode. */
export const ORDER_TYPE_FORM_MODE_TEXT: Record<OrderTypeFormMode, OrderTypeFormModeText> = {
  create: {
    title: "New Order Type",
    subtitle: "Fill in the order type details below.",
    submitLabel: "Create Order Type",
    submittingLabel: "Creating…",
    successMessage: "Order type created successfully.",
    failureMessage: "Unable to create order type. Please try again.",
  },
  edit: {
    title: "Edit Order Type",
    subtitle: "Update the order type details below.",
    submitLabel: "Update Order Type",
    submittingLabel: "Updating…",
    successMessage: "Order type updated successfully.",
    failureMessage: "Unable to update order type. Please try again.",
  },
};

/** Message shown in place of the form while it cannot be edited. */
export const ORDER_TYPE_FORM_STATUS_MESSAGE: Record<Exclude<OrderTypeFormStatus, "ready">, string> = {
  loading: "Loading order type data…",
  error: "Unable to load order type data. Please try again.",
};
