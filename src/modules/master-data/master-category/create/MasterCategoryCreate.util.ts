import type { ResolverResult } from "react-hook-form";

import type { ApiMessages } from "@/types/api.type";

import { CATEGORY_ACTIVE_STATUS, CATEGORY_INACTIVE_STATUS } from "../MasterCategory.config";
import type { CategoryCreatePayload, CategoryMutationResponse } from "../MasterCategory.type";

import { CATEGORY_FORM_DEFAULT_VALUES, CATEGORY_FORM_MESSAGE } from "./MasterCategoryCreate.config";
import type { CategoryDetailQueryState, CategoryFormSource, CategoryFormValues, CategorySubmitTarget } from "./MasterCategoryCreate.type";
import { CategoryDetailSchema, CategoryFormSchema } from "./MasterCategoryCreate.type";

/**
 * Join backend messages into one display string.
 * @param {ApiMessages} [messages] - Backend response messages
 * @returns {string} - Display message
 */
export const formatApiMessages = (messages?: ApiMessages): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages || CATEGORY_FORM_MESSAGE.REQUEST_FAILED;
};

/**
 * Normalize the category detail query into the form source (single upstream fallback).
 * @param {CategoryDetailQueryState} queryState - RTK Query data and flags; data is undefined in create mode
 * @returns {CategoryFormSource} - Form status and initial values
 */
export const normalizeCategoryFormSource = (queryState: CategoryDetailQueryState): CategoryFormSource => {
  const { data, isLoading, isError } = queryState;

  if (isLoading) {
    return { formStatus: "loading", initialValues: CATEGORY_FORM_DEFAULT_VALUES };
  }

  if (!data) {
    return { formStatus: isError ? "error" : "ready", initialValues: CATEGORY_FORM_DEFAULT_VALUES };
  }

  const parsedDetail = CategoryDetailSchema.safeParse(data.data);

  if (!data.status || !parsedDetail.success) {
    return { formStatus: "error", initialValues: CATEGORY_FORM_DEFAULT_VALUES };
  }

  return { formStatus: "ready", initialValues: parsedDetail.data };
};

/**
 * Validate category form values for react-hook-form with the Zod schema.
 * @param {CategoryFormValues} values - Current form values
 * @returns {ResolverResult<CategoryFormValues>} - Parsed values, or field errors
 */
export const resolveCategoryForm = (values: CategoryFormValues): ResolverResult<CategoryFormValues> => {
  const result = CategoryFormSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const [nameIssue] = result.error.issues;

  return { values: {}, errors: { name: { type: nameIssue.code, message: nameIssue.message } } };
};

/**
 * Build the create / update request body from form values.
 * @param {CategoryFormValues} values - Valid form values
 * @returns {CategoryCreatePayload} - Request body
 */
export const buildCategoryPayload = (values: CategoryFormValues): CategoryCreatePayload => ({
  category_name: values.name,
  status: values.isActive ? CATEGORY_ACTIVE_STATUS : CATEGORY_INACTIVE_STATUS,
});

/**
 * Send the update request when editing, otherwise the create request.
 * @param {CategoryFormValues} values - Valid form values
 * @param {CategorySubmitTarget} target - Mutation triggers and category id
 * @returns {Promise<CategoryMutationResponse>} - Mutation response
 */
export const sendCategoryMutation = (values: CategoryFormValues, target: CategorySubmitTarget): Promise<CategoryMutationResponse> => {
  const payload = buildCategoryPayload(values);

  if (target.id) {
    return target.updateCategory({ ...payload, id: target.id }).unwrap();
  }

  return target.createCategory(payload).unwrap();
};
