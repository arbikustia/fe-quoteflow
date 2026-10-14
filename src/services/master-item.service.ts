import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";
import type { ApiItem, ItemCreatePayload, ItemCreateResponse, ItemData, ItemListParams, ItemListResponse } from "@/modules/master-item/MasterItem.type";

/** Map API item model to UI model. */
export const mapItem = (item: ApiItem): ItemData => ({
  id: item.id,
  name: item.name,
  categoryId: item.category_id ?? "",
  price: item.price ?? 0,
  stock: item.stock ?? 0,
  image: item.image ?? "",
  duration: item.duration ?? 0,
  remark: item.remark ?? "",
  status: item.status === 1 ? "active" : "inactive",
  createAt: item.created_at ?? "",
  createBy: item.created_by ?? "",
});

export const masterItemService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<ItemListResponse, ItemListParams>({
      query: (params) => ({ url: "/api/item/paged", method: "GET", params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm } }),
      providesTags: ["Item"],
    }),
    getAllItems: builder.query<ItemListResponse, void>({ query: () => ({ url: "/api/item/get-all-item", method: "GET" }), providesTags: ["Item"] }),
    createItem: builder.mutation<ItemCreateResponse, ItemCreatePayload>({
      query: (body) => ({ url: "/api/item", method: "POST", data: body }),
      invalidatesTags: ["Item"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetItemsQuery, useGetAllItemsQuery, useCreateItemMutation } = masterItemService;
