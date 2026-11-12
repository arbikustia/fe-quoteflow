import type { ChangeEvent } from "react";
import { z } from "zod";

import type { ApiEnvelope, PaginatedResponse } from "@/types/api.type";

import { CATEGORY_ACTIVE_STATUS, CATEGORY_DATE_FORMAT, CATEGORY_EMPTY_DATE_VALUE } from "./MasterCategory.config";

/** Category status as shown in the UI. */
export type CategoryStatus = "active" | "inactive";

/** API status code (`1` = active) mapped to the UI status. */
const CategoryStatusSchema = z
  .number()
  .catch(0)
  .transform((status): CategoryStatus => (status === CATEGORY_ACTIVE_STATUS ? "active" : "inactive"));

/** API timestamp formatted for display, with a placeholder when absent. */
const CategoryDateSchema = z
  .string()
  .nullish()
  .transform((value): string => (value ? new Date(value).toLocaleDateString("id-ID", CATEGORY_DATE_FORMAT) : CATEGORY_EMPTY_DATE_VALUE));

/** Category row from `GET /api/category/paged`, normalized for display. */
export const CategoryListItemSchema = z
  .object({
    id: z.string(),
    category_name: z.string(),
    status: CategoryStatusSchema,
    created_at: CategoryDateSchema,
  })
  .transform((category) => ({
    id: category.id,
    categoryName: category.category_name,
    status: category.status,
    createdAt: category.created_at,
  }));

/** Raw category record as returned by the API. */
export type ApiCategory = z.input<typeof CategoryListItemSchema> & {
  created_by?: string | null;
  updated_at?: string | null;
};

/** Category row ready for the list view. */
export type CategoryData = z.output<typeof CategoryListItemSchema>;

/** Paged category list response. */
export type CategoryListResponse = PaginatedResponse<ApiCategory>;

/** Create / update / detail response for a single category. */
export type CategoryMutationResponse = ApiEnvelope<ApiCategory | null>;

/** Category option from `GET /api/category/get-all-category` (consumed by the item form). */
export type CategoryAllItem = {
  id: string;
  category_name: string;
};

/** Category lookup response. */
export type CategoryAllResponse = ApiEnvelope<CategoryAllItem[]>;

/** Create category request body. */
export type CategoryCreatePayload = {
  category_name: string;
  status: number;
};

/** Update category request body. */
export type CategoryUpdatePayload = CategoryCreatePayload & {
  id: string;
};

/** Paged category list query params. */
export type CategoryListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

/** Which part of the list view is rendered. */
export type CategoryListStatus = "loading" | "error" | "missing" | "empty" | "ready";

/** List statuses that render a message instead of rows. */
export type CategoryListMessageStatus = Exclude<CategoryListStatus, "loading" | "ready">;

/** Normalized paged list data. */
export type CategoryListView = {
  listStatus: CategoryListStatus;
  categories: CategoryData[];
  totalPages: number;
  totalCount: number;
};

/** Raw RTK Query state consumed by the list normalizer. */
export type CategoryListQueryState = {
  data?: CategoryListResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Router state the list page receives after a create / update. */
export type CategoryRouteState = {
  successMessage?: string;
} | null;

/** Router state the edit page receives from the list (the backend has no GET-by-id endpoint). */
export type CategoryEditRouteState = {
  category?: CategoryData;
} | null;

/** Paging and search state of the category list. */
export type CategoryListPaging = {
  queryParams: CategoryListParams;
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/** Navigation handlers of the category list. */
export type CategoryNavigation = {
  handleBack: () => void;
  handleCreate: () => void;
  handleEdit: (category: CategoryData) => void;
};

/** Category list state and handlers owned by the module hook. */
export type MasterCategoryController = CategoryListPaging & CategoryNavigation;

/** Props of the category mobile card. */
export type CategoryMobileCardProps = {
  category: CategoryData;
  canEdit: boolean;
  onEdit: (category: CategoryData) => void;
};

/** Props of the category list view. */
export type MasterCategoryProps = CategoryListView & {
  currentPage: number;
  pageSize: number;
  canCreate: boolean;
  canEdit: boolean;
  successMessage?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onCreate: () => void;
  onEdit: (category: CategoryData) => void;
};
