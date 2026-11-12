import type {
  CustomerFormMode,
  CustomerFormModeText,
  CustomerFormStatus,
  CustomerFormValues,
  CustomerInputField,
  CustomerInputFieldConfig,
} from "./MasterCustomerCreate.type";

export const CUSTOMER_FORM_MESSAGE = {
  NAME_REQUIRED: "Customer name is required.",
  EMAIL_REQUIRED: "Email is required.",
  EMAIL_INVALID: "Please enter a valid email address.",
  PHONE_REQUIRED: "Phone number is required.",
  PHONE_INVALID: "Phone number must contain 6–15 digits.",
  ADDRESS_REQUIRED: "Address is required.",
  REQUEST_FAILED: "Customer request failed.",
} as const;

/** Values of an empty create form. */
export const CUSTOMER_FORM_DEFAULT_VALUES: CustomerFormValues = {
  name: "",
  email: "",
  phoneNumber: "",
  address: "",
  isActive: true,
};

/** Copy per form mode. */
export const CUSTOMER_FORM_MODE_TEXT: Record<CustomerFormMode, CustomerFormModeText> = {
  create: {
    title: "New Customer",
    subtitle: "Fill in the customer details below.",
    submitLabel: "Create Customer",
    submittingLabel: "Creating…",
    successMessage: "Customer created successfully.",
    failureMessage: "Unable to create customer. Please try again.",
  },
  edit: {
    title: "Edit Customer",
    subtitle: "Update the customer details below.",
    submitLabel: "Update Customer",
    submittingLabel: "Updating…",
    successMessage: "Customer updated successfully.",
    failureMessage: "Unable to update customer. Please try again.",
  },
};

/** Message shown in place of the form while it cannot be edited. */
export const CUSTOMER_FORM_STATUS_MESSAGE: Record<Exclude<CustomerFormStatus, "ready">, string> = {
  loading: "Loading customer data…",
  error: "Unable to load customer data. Please try again.",
};

/** Static configuration of the text inputs. */
export const CUSTOMER_INPUT_FIELD: Record<CustomerInputField, CustomerInputFieldConfig> = {
  name: {
    id: "customer-name",
    label: "Customer Name",
    placeholder: "e.g. PT Mega Jaya Abadi",
    type: "text",
  },
  email: {
    id: "customer-email",
    label: "Email",
    placeholder: "e.g. customer@example.com",
    type: "email",
  },
  phoneNumber: {
    id: "customer-phone",
    label: "Phone Number",
    placeholder: "0812... or 628...",
    type: "tel",
    inputMode: "numeric",
    pattern: "[0-9]{6,15}",
    title: "Use 6–15 digits only. Allowed examples: 0812..., 628..., or 12...",
  },
};
