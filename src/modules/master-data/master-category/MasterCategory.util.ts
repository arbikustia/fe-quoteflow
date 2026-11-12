import { z } from "zod";

import type { CategoryListQueryState, CategoryListStatus, CategoryListView } from "./MasterCategory.type";
import { CategoryListItemSchema } from "./MasterCategory.type";

const CategoryListSchema = z.array(CategoryListItemSchema);

/**
 * Build an empty list view for a state without rows.
 * @param {CategoryListStatus} listStatus - List state to render
 * @returns {CategoryListView} - List view without rows
 */
const _createEmptyListView = (listStatus: CategoryListStatus): CategoryListView => ({
  listStatus,
  categories: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Normalize the paged category query into list view data (single upstream fallback).
 * @param {CategoryListQueryState} queryState - RTK Query data and flags
 * @returns {CategoryListView} - Normalized list view data
 */
export const normalizeCategoryList = (queryState: CategoryListQueryState): CategoryListView => {
  const { data, isLoading, isError } = queryState;

  if (isLoading) {
    return _createEmptyListView("loading");
  }

  if (isError) {
    return _createEmptyListView("error");
  }

  const parsedCategories = CategoryListSchema.safeParse(data?.data);

  if (!data || !parsedCategories.success) {
    return _createEmptyListView("missing");
  }

  return {
    listStatus: parsedCategories.data.length === 0 ? "empty" : "ready",
    categories: parsedCategories.data,
    totalPages: data.total_pages,
    totalCount: data.total_count,
  };
};

/**
 * Calculate the display row number of a category table row.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} - One-based row number across pages
 */
export const getCategoryRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number => {
  return (currentPage - 1) * pageSize + rowIndex + 1;
};
