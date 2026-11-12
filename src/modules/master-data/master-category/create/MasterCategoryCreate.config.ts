import type { CategoryFormMode, CategoryFormModeText, CategoryFormStatus, CategoryFormValues } from "./MasterCategoryCreate.type";

export const CATEGORY_FORM_MESSAGE = {
  NAME_REQUIRED: "Category name is required.",
  REQUEST_FAILED: "Category request failed.",
} as const;

/** Values of an empty create form. */
export const CATEGORY_FORM_DEFAULT_VALUES: CategoryFormValues = {
  name: "",
  isActive: true,
};

/** Copy per form mode. */
export const CATEGORY_FORM_MODE_TEXT: Record<CategoryFormMode, CategoryFormModeText> = {
  create: {
    title: "New Category",
    subtitle: "Fill in the category details below.",
    submitLabel: "Create Category",
    submittingLabel: "Creating…",
    successMessage: "Category created successfully.",
    failureMessage: "Unable to create category. Please try again.",
  },
  edit: {
    title: "Edit Category",
    subtitle: "Update the category details below.",
    submitLabel: "Update Category",
    submittingLabel: "Updating…",
    successMessage: "Category updated successfully.",
    failureMessage: "Unable to update category. Please try again.",
  },
};

/** Message shown in place of the form while it cannot be edited. */
export const CATEGORY_FORM_STATUS_MESSAGE: Record<Exclude<CategoryFormStatus, "ready">, string> = {
  loading: "Loading category data…",
  error: "Unable to load category data. Please try again.",
};
