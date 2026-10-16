import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type {
  CategoryAllResponse,
  CategoryCreatePayload,
  CategoryCreateResponse,
  CategoryUpdatePayload,
  CategoryData,
  CategoryListParams,
  CategoryListResponse,
} from "@/modules/master-category/MasterCategory.type";

const CATEGORY_TAG = "Category";

/**
 * Map API category model to UI model.
 * @param {CategoryListResponse["data"][number]} category - API category model
 * @returns {CategoryData} Category UI model
 */
export const mapCategory = (
  category: CategoryListResponse["data"][number],
): CategoryData => ({
  id: category.id,
  categoryName: category.category_name,
  status: category.status === 1 ? "active" : "inactive",
  createAt: category.created_at ?? "",
  createBy: category.created_by ?? "",
});

/** RTK Query endpoints for master category data. */
export const masterCategoryService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryListResponse, CategoryListParams>({
      query: (params) => ({
        url: ENDPOINT.MASTER_CATEGORY.PAGED,
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: [CATEGORY_TAG],
    }),
    createCategory: builder.mutation<
      CategoryCreateResponse,
      CategoryCreatePayload
    >({
      query: (body) => ({
        url: ENDPOINT.MASTER_CATEGORY.CREATE,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [CATEGORY_TAG],
    }),
    updateCategory: builder.mutation<CategoryCreateResponse, CategoryUpdatePayload>({
      query: (body) => ({
        url: `${ENDPOINT.MASTER_CATEGORY.CREATE}/${body.id}`,
        method: "PUT",
        data: { category_name: body.category_name, status: body.status },
      }),
      invalidatesTags: [CATEGORY_TAG],
    }),
    getAllCategories: builder.query<CategoryAllResponse, void>({
      query: () => ({
        url: ENDPOINT.MASTER_CATEGORY.ALL,
        method: "GET",
      }),
      providesTags: [CATEGORY_TAG],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useGetAllCategoriesQuery,
} = masterCategoryService;
