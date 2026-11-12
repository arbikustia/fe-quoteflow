import type { RoleFormMode, RoleFormModeText, RoleFormStatus, RoleFormValues } from "./MasterRoleCreate.type";

export const ROLE_FORM_MESSAGE = {
  NAME_REQUIRED: "Role name is required.",
  REQUEST_FAILED: "Role request failed.",
} as const;

/** Values of an empty create form. */
export const ROLE_FORM_DEFAULT_VALUES: RoleFormValues = {
  name: "",
  isActive: true,
};

/** Copy per form mode. */
export const ROLE_FORM_MODE_TEXT: Record<RoleFormMode, RoleFormModeText> = {
  create: {
    title: "New Role",
    subtitle: "Fill in the role details below.",
    submitLabel: "Create Role",
    submittingLabel: "Creating…",
    successMessage: "Role created successfully.",
    failureMessage: "Unable to create role. Please try again.",
  },
  edit: {
    title: "Edit Role",
    subtitle: "Update the role details below.",
    submitLabel: "Update Role",
    submittingLabel: "Updating…",
    successMessage: "Role updated successfully.",
    failureMessage: "Unable to update role. Please try again.",
  },
};

/** Message shown in place of the form while it cannot be edited. */
export const ROLE_FORM_STATUS_MESSAGE: Record<Exclude<RoleFormStatus, "ready">, string> = {
  loading: "Loading role data…",
  error: "Unable to load role data. Please try again.",
};
