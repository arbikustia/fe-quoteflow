import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type {
  ApiItem,
  ImageUploadResponse,
  ItemCreatePayload,
  ItemAllResponse,
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
  /**
   *
   * @param builder
   */
  endpoints: (builder) => ({
    getItems: builder.query<ItemListResponse, ItemListParams>({
      /**
       *
       * @param params
       */
      query: (params) => ({ url: ENDPOINT.MASTER_ITEM.PAGED, method: "GET", params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm } }),
      providesTags: ["Item"],
    }),
    getAllItems: builder.query<ItemAllResponse, void>({ /**
     *
     */
    query: () => ({ url: ENDPOINT.MASTER_ITEM.ALL, method: "GET" }), providesTags: ["Item"] }),
    uploadImage: builder.mutation<ImageUploadResponse, FormData>({
      query: (body) => ({
        url: ENDPOINT.IMAGE.UPLOAD,
        method: "POST",
        data: body,
        headers: { "Content-Type": "multipart/form-data" },
      }),
    }),
    getItemById: builder.query<ItemDetailResponse, string>({
      /**
       *
       * @param id
       */
      query: (id) => ({ url: `${ENDPOINT.MASTER_ITEM.DETAIL}/${id}`, method: "GET" }),
      /**
       *
       * @param _result
       * @param _error
       * @param id
       */
      providesTags: (_result, _error, id) => [{ type: "Item", id }],
    }),
    createItem: builder.mutation<ItemCreateResponse, ItemCreatePayload>({
      /**
       *
       * @param body
       */
      query: (body) => ({ url: ENDPOINT.MASTER_ITEM.CREATE, method: "POST", data: body }),
      invalidatesTags: ["Item"],
    }),
    updateItem: builder.mutation<ItemCreateResponse, ItemUpdatePayload>({
      /**
       *
       * @param body
       */
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
  useUploadImageMutation,
  useGetItemByIdQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
} = masterItemService;
