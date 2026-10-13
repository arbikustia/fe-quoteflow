import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type {
  ApiItem,
  ItemCreatePayload,
  ItemCreateResponse,
  ItemData,
  ItemListParams,
  ItemListResponse,
} from "./MasterItem.type";

/**
 * Map API item model to ItemData UI model.
 * @param {ItemListResponse["data"]["data"][number]} item - Raw API item object
 * @returns {ItemData} Mapped item model
 */
export const _mapItem = (
  item: ApiItem,
): ItemData => ({
  id: item.id,
  name: item.name,
  category: item.category ?? "",
  price: item.price ?? 0,
  stock: item.stock ?? 0,
  image: item.image ?? "",
  duration: item.duration ?? "",
  remark: item.remark ?? "",
  unit: item.unit ?? "",
  status: item.status === 1 ? "active" : "inactive",
  createAt: item.created_at ?? "",
  createBy: item.created_by ?? "",
});

export const masterItemApi = apiRtkClient.injectEndpoints({
  /**
   * Define endpoints for master item API
   * @param {object} builder - RTK Query endpoint builder
   * @returns {object} Endpoint definitions
   */
  endpoints: (builder) => ({
    /**
     * GET /api/item/paged - Fetch paginated items
     * @param {ItemListParams} params - Query parameters
     * @returns {Promise<ItemListResponse>} Paginated item list
     */
    getItems: builder.query<ItemListResponse, ItemListParams>({
      /**
       * Configure the query for fetching items
       * @param {ItemListParams} params - Query parameters
       * @returns {object} RTK Query configuration
       */
      query: (params) => ({
        url: "/api/item/paged",
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: ["Item"],
    }),
    /**
     * GET /api/item/get-all-item - Fetch all items without pagination
     * @returns {Promise<ItemListResponse>} All items list
     */
    getAllItems: builder.query<ItemListResponse, void>({
      /**
       * Configure the query for fetching all items
       * @returns {object} RTK Query configuration
       */
      query: () => ({
        url: "/api/item/get-all-item",
        method: "GET",
      }),
      providesTags: ["Item"],
    }),
    /**
     * POST /api/item - Create a new item
     * @param {ItemCreatePayload} body - Item creation payload
     * @returns {Promise<ItemCreateResponse>} Created item response
     */
    createItem: builder.mutation<ItemCreateResponse, ItemCreatePayload>({
      /**
       * Configure the mutation for creating an item
       * @param {ItemCreatePayload} body - Item creation payload
       * @returns {object} RTK Query configuration
       */
      query: (body) => ({
        url: "/api/item",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Item"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetItemsQuery, useGetAllItemsQuery, useCreateItemMutation } = masterItemApi;

