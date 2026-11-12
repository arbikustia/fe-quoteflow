import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type {
  ImageUploadResponse,
  ItemAllResponse,
  ItemCreatePayload,
  ItemListParams,
  ItemListResponse,
  ItemMutationResponse,
  ItemUpdatePayload,
} from "@/modules/master-data/master-item/MasterItem.type";

import ENDPOINT from "@/constants/endpoint.constant";

const ITEM_TAG = "Item";

export const masterItemService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<ItemListResponse, ItemListParams>({
      query: (params) => ({
        url: ENDPOINT.MASTER_ITEM.PAGED,
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: [ITEM_TAG],
    }),
    getAllItems: builder.query<ItemAllResponse, void>({
      query: () => ({ url: ENDPOINT.MASTER_ITEM.ALL, method: "GET" }),
      providesTags: [ITEM_TAG],
    }),
    uploadImage: builder.mutation<ImageUploadResponse, FormData>({
      query: (body) => ({
        url: ENDPOINT.IMAGE.UPLOAD,
        method: "POST",
        data: body,
        headers: { "Content-Type": "multipart/form-data" },
      }),
    }),
    createItem: builder.mutation<ItemMutationResponse, ItemCreatePayload>({
      query: (body) => ({ url: ENDPOINT.MASTER_ITEM.CREATE, method: "POST", data: body }),
      invalidatesTags: [ITEM_TAG],
    }),
    updateItem: builder.mutation<ItemMutationResponse, ItemUpdatePayload>({
      query: ({ id, ...body }) => ({ url: `${ENDPOINT.MASTER_ITEM.DETAIL}/${id}`, method: "PUT", data: body }),
      invalidatesTags: [ITEM_TAG],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetItemsQuery,
  useGetAllItemsQuery,
  useUploadImageMutation,
  useCreateItemMutation,
  useUpdateItemMutation,
} = masterItemService;
