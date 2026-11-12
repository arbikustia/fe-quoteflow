import type {
  EmailSenderFormMode,
  EmailSenderFormModeText,
  EmailSenderFormStatus,
  EmailSenderFormValues,
} from "./MasterEmailSenderCreate.type";

export const EMAIL_SENDER_FORM_MESSAGE = {
  NAME_REQUIRED: "Name is required.",
  EMAIL_REQUIRED: "Email is required.",
  EMAIL_INVALID: "Email is not valid.",
  SMTP_HOST_REQUIRED: "SMTP Host is required.",
  SMTP_PORT_REQUIRED: "SMTP Port is required.",
  SMTP_PORT_INVALID: "SMTP Port must be between 1 and 65535.",
  SMTP_USERNAME_REQUIRED: "SMTP Username is required.",
  SMTP_PASSWORD_REQUIRED: "SMTP Password is required.",
  REQUEST_FAILED: "Email sender request failed.",
} as const;

/** Highest valid TCP port number. */
export const EMAIL_SENDER_MAX_PORT = 65535;

/** Values of an empty create form. */
export const EMAIL_SENDER_FORM_DEFAULT_VALUES: EmailSenderFormValues = {
  name: "",
  email: "",
  smtpHost: "",
  smtpPort: 587,
  smtpUsername: "",
  smtpPassword: "",
  enableSsl: true,
  isDefault: false,
  isActive: true,
};

/** Copy per form mode. */
export const EMAIL_SENDER_FORM_MODE_TEXT: Record<EmailSenderFormMode, EmailSenderFormModeText> = {
  create: {
    title: "New Email Sender",
    subtitle: "Manage SMTP email sender settings",
    submitLabel: "Create Email Sender",
    submittingLabel: "Creating…",
    passwordPlaceholder: "Enter SMTP password",
    successMessage: "Email sender created successfully.",
    failureMessage: "Unable to create email sender.",
  },
  edit: {
    title: "Edit Email Sender",
    subtitle: "Manage SMTP email sender settings",
    submitLabel: "Update Email Sender",
    submittingLabel: "Updating…",
    passwordPlaceholder: "Leave blank to keep current password",
    successMessage: "Email sender updated successfully.",
    failureMessage: "Unable to update email sender.",
  },
};

/** Message shown in place of the form while it cannot be edited. */
export const EMAIL_SENDER_FORM_STATUS_MESSAGE: Record<Exclude<EmailSenderFormStatus, "ready">, string> = {
  loading: "Loading email sender data…",
  error: "Unable to load email sender data. Please try again.",
};
