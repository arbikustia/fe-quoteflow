import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type {
  PicCreatePayload,
  PicCreateResponse,
  PicData,
  PicListParams,
  PicListResponse,
} from "./MasterPic.type";

/**
 * Map API PIC model to PIC UI model.
 * @param {PicListResponse["data"][number]} pic - Raw API PIC object
 * @returns {PicData} Mapped PIC model
 */
export const _mapPic = (pic: PicListResponse["data"][number]): PicData => ({
  id: pic.id,
  name: pic.name,
  status: pic.status === 1 ? "active" : "inactive",
  createAt: pic.created_at ?? "",
  createBy: pic.created_by ?? "",
});

export const masterPicApi = apiRtkClient.injectEndpoints({
  /**
   * Define endpoints for master PIC API.
   * @param {object} builder - RTK Query endpoint builder
   * @returns {object} Endpoint definitions
   */
  endpoints: (builder) => ({
    getPics: builder.query<PicListResponse, PicListParams>({
      /**
       * Configure query for fetching PIC list.
       * @param {PicListParams} params - Query parameters
       * @returns {object} RTK Query configuration
       */
      query: (params) => ({
        url: "/api/pic/paged",
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: ["Pic"],
    }),
    createPic: builder.mutation<PicCreateResponse, PicCreatePayload>({
      /**
       * Configure mutation for creating PIC.
       * @param {PicCreatePayload} body - PIC creation payload
       * @returns {object} RTK Query configuration
       */
      query: (body) => ({
        url: "/api/pic",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Pic"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetPicsQuery, useCreatePicMutation } = masterPicApi;
