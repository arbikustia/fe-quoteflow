import type { UserFormMode, UserFormModeText, UserFormStatus, UserFormValues } from "./MasterUserCreate.type";

export const USER_FORM_MESSAGE = {
  USERNAME_REQUIRED: "Username is required.",
  EMAIL_REQUIRED: "Email is required.",
  EMAIL_INVALID: "Invalid email address.",
  PASSWORD_REQUIRED: "Password is required.",
  ROLE_REQUIRED: "Role is required.",
  REQUEST_FAILED: "User request failed.",
  ROLES_FAILED: "Unable to load roles.",
} as const;

/** Hint shown under the password input. */
export const USER_PASSWORD_HINT =
  "Password harus terdiri dari minimal 11 karakter. Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol agar password lebih aman.";

/** Values of an empty create form. */
export const USER_FORM_DEFAULT_VALUES: UserFormValues = {
  username: "",
  email: "",
  password: "",
  role: "",
  isActive: true,
};

/** Copy per form mode. */
export const USER_FORM_MODE_TEXT: Record<UserFormMode, UserFormModeText> = {
  create: {
    title: "New User",
    subtitle: "Fill in the user details below.",
    submitLabel: "Create User",
    submittingLabel: "Creating…",
    successMessage: "User created successfully.",
    failureMessage: "Unable to create user. Please try again.",
  },
  edit: {
    title: "Edit User",
    subtitle: "Update the user details below.",
    submitLabel: "Update User",
    submittingLabel: "Updating…",
    successMessage: "User updated successfully.",
    failureMessage: "Unable to update user. Please try again.",
  },
};

/** Message shown in place of the form while it cannot be edited. */
export const USER_FORM_STATUS_MESSAGE: Record<Exclude<UserFormStatus, "ready">, string> = {
  loading: "Loading user data…",
  error: "Unable to load user data. Please try again.",
};
