import type { PicFormMode, PicFormModeText, PicFormStatus, PicFormValues } from "./MasterPicCreate.type";

export const PIC_FORM_MESSAGE = {
  NAME_REQUIRED: "PIC name is required.",
  REQUEST_FAILED: "PIC request failed.",
} as const;

/** Values of an empty create form. */
export const PIC_FORM_DEFAULT_VALUES: PicFormValues = {
  name: "",
  isActive: true,
};

/** Copy per form mode. */
export const PIC_FORM_MODE_TEXT: Record<PicFormMode, PicFormModeText> = {
  create: {
    title: "New PIC",
    subtitle: "Fill in the PIC details below.",
    submitLabel: "Create PIC",
    submittingLabel: "Creating…",
    successMessage: "PIC created successfully.",
    failureMessage: "Unable to create PIC. Please try again.",
  },
  edit: {
    title: "Edit PIC",
    subtitle: "Update the PIC details below.",
    submitLabel: "Update PIC",
    submittingLabel: "Updating…",
    successMessage: "PIC updated successfully.",
    failureMessage: "Unable to update PIC. Please try again.",
  },
};

/** Message shown in place of the form while it cannot be edited. */
export const PIC_FORM_STATUS_MESSAGE: Record<Exclude<PicFormStatus, "ready">, string> = {
  error: "PIC data is unavailable. Open the PIC from the PIC list to edit it.",
};
