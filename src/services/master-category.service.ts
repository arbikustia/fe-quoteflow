import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";
import type { CategoryAllResponse, CategoryCreatePayload, CategoryCreateResponse, CategoryData, CategoryListParams, CategoryListResponse } from "@/modules/master-category/MasterCategory.type";

/** Map API category model to UI model. */
export const mapCategory = (category: CategoryListResponse["data"][number]): CategoryData => ({
  id: category.id,
  categoryName: category.category_name,
  status: category.status === 1 ? "active" : "inactive",
  createAt: category.created_at ?? "",
  createBy: category.created_by ?? "",
});

export const masterCategoryService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryListResponse, CategoryListParams>({ query: (params) => ({ url: "/api/category/paged", method: "GET", params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm } }), providesTags: ["Category"] }),
    createCategory: builder.mutation<CategoryCreateResponse, CategoryCreatePayload>({ query: (body) => ({ url: "/api/category", method: "POST", data: body }), invalidatesTags: ["Category"] }),
    getAllCategories: builder.query<CategoryAllResponse, void>({ query: () => ({ url: "/api/category/get-all-category", method: "GET" }), providesTags: ["Category"] }),
  }),
  overrideExisting: false,
});

export const { useGetCategoriesQuery, useCreateCategoryMutation, useGetAllCategoriesQuery } = masterCategoryService;
