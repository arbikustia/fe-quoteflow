import { useGetAllCategoriesQuery } from "@/services/master-category.service";

import type { CategorySelectState } from "./useCategorySelectOptions.type";

import type { ApiMessages } from "@/types/api.type";

const CATEGORY_OPTIONS_MESSAGE = {
  LOAD_FAILED: "Unable to load categories.",
  NO_RESPONSE: "No response received from server.",
  REQUEST_FAILED: "Category request failed.",
} as const;

/**
 * Join backend messages into one display string.
 * @param {ApiMessages} messages - Backend response messages
 * @returns {string} - Display message
 */
export const _formatCategoryMessages = (messages: ApiMessages): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages || CATEGORY_OPTIONS_MESSAGE.REQUEST_FAILED;
};

/**
 * Load all categories for select / dropdown inputs.
 * @returns {CategorySelectState} - Category options, loading and error state
 */
export const useCategorySelectOptions = (): CategorySelectState => {
  const { data, isError, isLoading } = useGetAllCategoriesQuery();

  if (isLoading) {
    return { categories: [], isLoading: true, errorMessage: null };
  }

  if (isError) {
    return { categories: [], isLoading: false, errorMessage: CATEGORY_OPTIONS_MESSAGE.LOAD_FAILED };
  }

  if (!data) {
    return { categories: [], isLoading: false, errorMessage: CATEGORY_OPTIONS_MESSAGE.NO_RESPONSE };
  }

  if (!data.status) {
    return { categories: [], isLoading: false, errorMessage: _formatCategoryMessages(data.messages) };
  }

  return { categories: data.data, isLoading: false, errorMessage: null };
};
