import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type {
  ApiItem,
  ItemCreatePayload,
  ItemCreateResponse,
  ItemData,
  ItemDetailResponse,
  ItemListParams,
  ItemListResponse,
  ItemUpdatePayload,
} from "@/modules/master-item/MasterItem.type";

/**
 * Map API item model to UI model.
 * @param {ApiItem} item - API item model
 * @returns {ItemData} UI item model
 */
export const mapItem = (item: ApiItem): ItemData => ({
  id: item.id,
  name: item.name,
  categoryId: item.category_id,
  categoryName: item.category_name ?? null,
  price: item.price ?? 0,
  stock: item.stock ?? 0,
  image: item.image,
  duration: item.duration ?? 0,
  remark: item.remark,
  status: item.status === 1 ? "active" : "inactive",
  createAt: item.created_at,
  createBy: item.created_by,
});

export const masterItemService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<ItemListResponse, ItemListParams>({
      query: (params) => ({ url: ENDPOINT.MASTER_ITEM.PAGED, method: "GET", params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm } }),
      providesTags: ["Item"],
    }),
    getAllItems: builder.query<ItemListResponse, void>({ query: () => ({ url: ENDPOINT.MASTER_ITEM.ALL, method: "GET" }), providesTags: ["Item"] }),
    getItemById: builder.query<ItemDetailResponse, string>({
      query: (id) => ({ url: `${ENDPOINT.MASTER_ITEM.DETAIL}/${id}`, method: "GET" }),
      providesTags: (_result, _error, id) => [{ type: "Item", id }],
    }),
    createItem: builder.mutation<ItemCreateResponse, ItemCreatePayload>({
      query: (body) => ({ url: ENDPOINT.MASTER_ITEM.CREATE, method: "POST", data: body }),
      invalidatesTags: ["Item"],
    }),
    updateItem: builder.mutation<ItemCreateResponse, ItemUpdatePayload>({
      query: (body) => ({
        url: `${ENDPOINT.MASTER_ITEM.CREATE}/${body.id}`,
        method: "PUT",
        data: {
          name: body.name,
          category_id: body.category_id,
          price: body.price,
          stock: body.stock,
          image: body.image,
          duration: body.duration,
          remark: body.remark,
          status: body.status,
        },
      }),
      invalidatesTags: ["Item"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetItemsQuery,
  useGetAllItemsQuery,
  useGetItemByIdQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
} = masterItemService;
