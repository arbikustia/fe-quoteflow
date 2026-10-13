import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type {
  CategoryCreatePayload,
  CategoryCreateResponse,
  CategoryData,
  CategoryListParams,
  CategoryListResponse,
} from "./MasterCategory.type";

/**
 * Map API category model to CategoryData UI model.
 * @param {CategoryListResponse["data"]["data"][number]} category - Raw API category object
 * @returns {CategoryData} Mapped category model
 */
export const _mapCategory = (
  category: CategoryListResponse["data"]["data"][number],
): CategoryData => ({
  id: category.id,
  categoryName: category.name,
  status: category.status === 1 ? "active" : "inactive",
  createAt: category.created_at ?? "",
  createBy: category.created_by ?? "",
});

export const masterCategoryApi = apiRtkClient.injectEndpoints({
  /**
   * Define endpoints for master category API
   * @param {object} builder - RTK Query endpoint builder
   * @returns {object} Endpoint definitions
   */
  endpoints: (builder) => ({
    /**
     * GET /api/category/paged - Fetch paginated categories
     * @param {CategoryListParams} params - Query parameters
     * @returns {Promise<CategoryListResponse>} Paginated category list
     */
    getCategories: builder.query<CategoryListResponse, CategoryListParams>({
      /**
       * Configure the query for fetching categories
       * @param {CategoryListParams} params - Query parameters
       * @returns {object} RTK Query configuration
       */
      query: (params) => ({
        url: "/api/category/paged",
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: ["Category"],
    }),
    /**
     * POST /api/category - Create a new category
     * @param {CategoryCreatePayload} body - Category creation payload
     * @returns {Promise<CategoryCreateResponse>} Created category response
     */
    createCategory: builder.mutation<CategoryCreateResponse, CategoryCreatePayload>({
      /**
       * Configure the mutation for creating a category
       * @param {CategoryCreatePayload} body - Category creation payload
       * @returns {object} RTK Query configuration
       */
      query: (body) => ({
        url: "/api/category",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Category"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetCategoriesQuery, useCreateCategoryMutation } = masterCategoryApi;