import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constants/endpoint.constant";

import type {
  CategoryAllResponse,
  CategoryCreatePayload,
  CategoryListParams,
  CategoryListResponse,
  CategoryMutationResponse,
  CategoryUpdatePayload,
} from "@/modules/master-data/master-category/MasterCategory.type";

const CATEGORY_TAG = "Category";

export const masterCategoryService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query<CategoryAllResponse, void>({
      query: () => ({ url: ENDPOINT.MASTER_CATEGORY.ALL, method: "GET" }),
      providesTags: [CATEGORY_TAG],
    }),
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
    createCategory: builder.mutation<CategoryMutationResponse, CategoryCreatePayload>({
      query: (body) => ({ url: ENDPOINT.MASTER_CATEGORY.CREATE, method: "POST", data: body }),
      invalidatesTags: [CATEGORY_TAG],
    }),
    updateCategory: builder.mutation<CategoryMutationResponse, CategoryUpdatePayload>({
      query: (body) => ({
        url: `${ENDPOINT.MASTER_CATEGORY.CREATE}/${body.id}`,
        method: "PUT",
        data: { category_name: body.category_name, status: body.status },
      }),
      invalidatesTags: [CATEGORY_TAG],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} = masterCategoryService;
