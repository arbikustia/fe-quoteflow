import type {
  ProjectFieldName,
  ProjectFormMode,
  ProjectFormModeText,
  ProjectFormStatus,
  ProjectFormStep,
  ProjectFormValues,
  ProjectItemsStatus,
} from "./MasterProjectCreate.type";

export const PROJECT_FORM_MESSAGE = {
  ITEMS_REQUIRED: "Select at least one item.",
  NAME_REQUIRED: "Project name is required.",
  PRICE_REQUIRED: "Project price is required.",
  PRICE_INVALID: "Project price cannot be negative.",
  REQUEST_FAILED: "Project request failed.",
} as const;

/** Lowest quantity of a selected item. */
export const PROJECT_ITEM_MIN_QTY = 1;

/** Values of an empty create form. */
export const PROJECT_FORM_DEFAULT_VALUES: ProjectFormValues = {
  selectedItems: [],
  name: "",
  price: null,
  remark: "",
  isActive: true,
};

/** Wizard steps in order. */
export const PROJECT_FORM_STEPS: readonly ProjectFormStep[] = ["items", "information", "preview"];

/** Tab label per wizard step. */
export const PROJECT_FORM_STEP_LABEL: Record<ProjectFormStep, string> = {
  items: "Items",
  information: "Information",
  preview: "Preview",
};

/** Fields validated before leaving each wizard step. */
export const PROJECT_FORM_STEP_FIELDS: Record<ProjectFormStep, ProjectFieldName[]> = {
  items: ["selectedItems"],
  information: ["name", "price", "remark", "isActive"],
  preview: [],
};

/** Copy per form mode. */
export const PROJECT_FORM_MODE_TEXT: Record<ProjectFormMode, ProjectFormModeText> = {
  create: {
    title: "New Project",
    subtitle: "Build project in three steps.",
    submitLabel: "Save Project",
    submittingLabel: "Saving…",
    successMessage: "Project created successfully.",
    failureMessage: "Unable to create project. Please try again.",
  },
  edit: {
    title: "Edit Project",
    subtitle: "Update project items and details.",
    submitLabel: "Update Project",
    submittingLabel: "Updating…",
    successMessage: "Project updated successfully.",
    failureMessage: "Unable to update project. Please try again.",
  },
};

/** Message shown in place of the form while it cannot be edited. */
export const PROJECT_FORM_STATUS_MESSAGE: Record<Exclude<ProjectFormStatus, "ready">, string> = {
  loading: "Loading project data…",
  error: "Unable to load project data. Please try again.",
};

/** Message shown in place of the item options. */
export const PROJECT_ITEMS_STATUS_MESSAGE: Record<Exclude<ProjectItemsStatus, "ready">, string> = {
  loading: "Loading items…",
  error: "Unable to load items.",
  empty: "No items available.",
};
