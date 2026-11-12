import type { FieldError, FieldErrors, ResolverResult } from "react-hook-form";
import { z } from "zod";

import type { ApiMessages } from "@/types/api.type";

import { PROJECT_ACTIVE_STATUS, PROJECT_INACTIVE_STATUS } from "../MasterProject.config";
import type { ApiProjectItem, ProjectCreatePayload, ProjectDetailResponse } from "../MasterProject.type";

import {
  PROJECT_FORM_DEFAULT_VALUES,
  PROJECT_FORM_MESSAGE,
  PROJECT_FORM_STEPS,
  PROJECT_ITEM_MIN_QTY,
} from "./MasterProjectCreate.config";
import type {
  ProjectFieldErrors,
  ProjectFieldName,
  ProjectFormSource,
  ProjectFormSourceParams,
  ProjectFormStep,
  ProjectFormStepDirection,
  ProjectFormValues,
  ProjectItemOption,
  ProjectItemsQueryState,
  ProjectItemsView,
  ProjectSelectedItem,
  ProjectSubmitTarget,
  ProjectValidValues,
} from "./MasterProjectCreate.type";
import { ProjectFormDetailSchema, ProjectFormSchema, ProjectItemOptionSchema } from "./MasterProjectCreate.type";

const ProjectItemOptionListSchema = z.array(ProjectItemOptionSchema);

/**
 * Join backend messages into one display string.
 * @param {ApiMessages} [messages] - Backend response messages
 * @returns {string} - Display message
 */
export const formatApiMessages = (messages?: ApiMessages): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages || PROJECT_FORM_MESSAGE.REQUEST_FAILED;
};

/**
 * Format a price as Indonesian Rupiah.
 * @param {number} price - Price in Rupiah
 * @returns {string} - Formatted price
 */
export const formatProjectPrice = (price: number): string => `Rp ${price.toLocaleString("id-ID")}`;

/**
 * Keep a quantity between the minimum and the item stock.
 * @param {number} quantity - Requested quantity
 * @param {number} stock - Available stock
 * @returns {number} - Clamped quantity
 */
export const clampItemQuantity = (quantity: number, stock: number): number => {
  return Math.max(PROJECT_ITEM_MIN_QTY, Math.min(quantity, stock));
};

/**
 * Normalize the all-items query into item options (single upstream fallback).
 * @param {ProjectItemsQueryState} queryState - RTK Query data and flags
 * @returns {ProjectItemsView} - Item status and options
 */
export const normalizeProjectItemOptions = (queryState: ProjectItemsQueryState): ProjectItemsView => {
  const { data, isLoading, isError } = queryState;

  if (isLoading) {
    return { itemsStatus: "loading", itemOptions: [] };
  }

  const parsedItems = ProjectItemOptionListSchema.safeParse(data?.data);

  if (isError || !data?.status || !parsedItems.success) {
    return { itemsStatus: "error", itemOptions: [] };
  }

  return { itemsStatus: parsedItems.data.length === 0 ? "empty" : "ready", itemOptions: parsedItems.data };
};

/**
 * Resolve the items of a loaded project against the item options; items without an option are dropped.
 * @param {ApiProjectItem[]} projectItems - Items stored on the project
 * @param {ProjectItemOption[]} itemOptions - Available item options
 * @returns {ProjectSelectedItem[]} - Selected items with quantities within stock
 */
export const buildProjectSelectedItems = (projectItems: ApiProjectItem[], itemOptions: ProjectItemOption[]): ProjectSelectedItem[] => {
  return projectItems.flatMap((projectItem) => {
    const option = itemOptions.find((item) => item.id === projectItem.item_id);

    if (!option) {
      return [];
    }

    return [{ ...option, qty: clampItemQuantity(projectItem.qty, option.stock) }];
  });
};

/**
 * Normalize the loaded project into the form source (single upstream fallback).
 * @param {ProjectFormSourceParams} params - Project query state and item options
 * @returns {ProjectFormSource} - Form status and initial values
 */
export const normalizeProjectFormSource = (params: ProjectFormSourceParams): ProjectFormSource => {
  const { data, isLoading, isError, itemsView } = params;

  if (isLoading) {
    return { formStatus: "loading", initialValues: PROJECT_FORM_DEFAULT_VALUES };
  }

  if (!data) {
    return { formStatus: isError ? "error" : "ready", initialValues: PROJECT_FORM_DEFAULT_VALUES };
  }

  // Selected items need the item options (name, stock, price) before the form is seeded
  if (itemsView.itemsStatus === "loading") {
    return { formStatus: "loading", initialValues: PROJECT_FORM_DEFAULT_VALUES };
  }

  const parsedDetail = ProjectFormDetailSchema.safeParse(data.data);

  if (!data.status || !parsedDetail.success) {
    return { formStatus: "error", initialValues: PROJECT_FORM_DEFAULT_VALUES };
  }

  const { items, ...detail } = parsedDetail.data;

  return { formStatus: "ready", initialValues: { ...detail, selectedItems: buildProjectSelectedItems(items, itemsView.itemOptions) } };
};

/**
 * Add an item with the minimum quantity, or remove it when already selected.
 * @param {ProjectSelectedItem[]} selectedItems - Currently selected items
 * @param {ProjectItemOption} item - Item to toggle
 * @returns {ProjectSelectedItem[]} - Updated selection
 */
export const toggleSelectedItem = (selectedItems: ProjectSelectedItem[], item: ProjectItemOption): ProjectSelectedItem[] => {
  if (selectedItems.some((selected) => selected.id === item.id)) {
    return selectedItems.filter((selected) => selected.id !== item.id);
  }

  return [...selectedItems, { ...item, qty: PROJECT_ITEM_MIN_QTY }];
};

/**
 * Change the quantity of a selected item, kept within its stock.
 * @param {ProjectSelectedItem[]} selectedItems - Currently selected items
 * @param {string} itemId - Item to update
 * @param {number} quantity - Requested quantity
 * @returns {ProjectSelectedItem[]} - Updated selection
 */
export const updateSelectedItemQuantity = (selectedItems: ProjectSelectedItem[], itemId: string, quantity: number): ProjectSelectedItem[] => {
  return selectedItems.map((selected) => (selected.id === itemId ? { ...selected, qty: clampItemQuantity(quantity, selected.stock) } : selected));
};

/**
 * Find the selection entry of an item.
 * @param {ProjectSelectedItem[]} selectedItems - Currently selected items
 * @param {string} itemId - Item to look up
 * @returns {ProjectSelectedItem | undefined} - Selection entry, or undefined when not selected
 */
export const findSelectedItem = (selectedItems: ProjectSelectedItem[], itemId: string): ProjectSelectedItem | undefined => {
  return selectedItems.find((selected) => selected.id === itemId);
};

/**
 * Get the wizard step next to the given one, staying within the first and last step.
 * @param {ProjectFormStep} step - Current step
 * @param {ProjectFormStepDirection} direction - 1 for the next step, -1 for the previous one
 * @returns {ProjectFormStep} - Adjacent step
 */
export const getAdjacentFormStep = (step: ProjectFormStep, direction: ProjectFormStepDirection): ProjectFormStep => {
  const stepIndex = PROJECT_FORM_STEPS.indexOf(step) + direction;

  return PROJECT_FORM_STEPS[Math.max(0, Math.min(stepIndex, PROJECT_FORM_STEPS.length - 1))];
};

/**
 * Validate form values with the project schema; react-hook-form resolver.
 * @param {ProjectFormValues} values - Current form values
 * @returns {ResolverResult<ProjectFormValues, ProjectValidValues>} - Parsed values, or the first error per field
 */
export const resolveProjectForm = (values: ProjectFormValues): ResolverResult<ProjectFormValues, ProjectValidValues> => {
  const result = ProjectFormSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: Partial<Record<ProjectFieldName, FieldError>> = {};

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as ProjectFieldName;

    errors[field] = errors[field] ?? { type: issue.code, message: issue.message };
  });

  // Array fields (selectedItems) report one message for the whole field
  return { values: {}, errors: errors as FieldErrors<ProjectFormValues> };
};

/**
 * Whether a changed field is validated right away: after a submit, or while it shows an error.
 * @param {boolean} isSubmitted - Whether the form was submitted
 * @param {FieldErrors<ProjectFormValues>} errors - Current field errors
 * @param {ProjectFieldName} field - Changed field
 * @returns {boolean} - True to validate on change
 */
export const shouldValidateField = (isSubmitted: boolean, errors: FieldErrors<ProjectFormValues>, field: ProjectFieldName): boolean => {
  return isSubmitted || Boolean(errors[field]);
};

/**
 * Pick the message of every field error.
 * @param {FieldErrors<ProjectFormValues>} errors - react-hook-form errors
 * @returns {ProjectFieldErrors} - Message per field
 */
export const getProjectFieldErrors = (errors: FieldErrors<ProjectFormValues>): ProjectFieldErrors => {
  const fieldErrors: ProjectFieldErrors = {};

  (Object.keys(errors) as ProjectFieldName[]).forEach((field) => {
    fieldErrors[field] = errors[field]?.message;
  });

  return fieldErrors;
};

/**
 * Build the create / update request body from validated form values.
 * @param {ProjectValidValues} values - Valid form values
 * @returns {ProjectCreatePayload} - Request body
 */
export const buildProjectPayload = (values: ProjectValidValues): ProjectCreatePayload => ({
  name: values.name,
  remark: values.remark,
  price: values.price,
  status: values.isActive ? PROJECT_ACTIVE_STATUS : PROJECT_INACTIVE_STATUS,
  items: values.selectedItems.map((item) => ({ item_id: item.id, qty: item.qty, price: item.price })),
});

/**
 * Send the update request when editing, otherwise the create request.
 * @param {ProjectValidValues} values - Valid form values
 * @param {ProjectSubmitTarget} target - Mutation triggers and project id
 * @returns {Promise<ProjectDetailResponse>} - Mutation response
 */
export const sendProjectMutation = (values: ProjectValidValues, target: ProjectSubmitTarget): Promise<ProjectDetailResponse> => {
  const payload = buildProjectPayload(values);

  if (target.id) {
    return target.updateProject({ ...payload, id: target.id }).unwrap();
  }

  return target.createProject(payload).unwrap();
};
