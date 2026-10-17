import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type {
  ApiPic,
  PicCreatePayload,
  PicCreateResponse,
  PicData,
  PicDetailResponse,
  PicListParams,
  PicListResponse,
  PicUpdatePayload,
} from "@/modules/master-pic/MasterPic.type";

/** Map API PIC model to UI model. */
export const mapPic = (item: ApiPic): PicData => ({
  id: item.id,
  name: item.name,
  status: item.status === 1 ? "active" : "inactive",
  createAt: item.created_at,
  createBy: item.created_by,
});

export type { ApiPic, PicCreatePayload, PicCreateResponse, PicDetailResponse, PicListParams, PicListResponse, PicUpdatePayload };

export const masterPicService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getPics: builder.query<PicListResponse, PicListParams>({ query: (params) => ({ url: ENDPOINT.MASTER_PIC.PAGED, method: "GET", params }), providesTags: ["Pic"] }),
    createPic: builder.mutation<PicCreateResponse, PicCreatePayload>({ query: (body) => ({ url: ENDPOINT.MASTER_PIC.CREATE, method: "POST", data: body }), invalidatesTags: ["Pic"] }),
    getPicById: builder.query<PicDetailResponse, string>({ query: (id) => ({ url: `${ENDPOINT.MASTER_PIC.DETAIL}/${id}`, method: "GET" }), providesTags: ["Pic"] }),
    updatePic: builder.mutation<PicCreateResponse, PicUpdatePayload>({
      query: (body) => ({ url: `${ENDPOINT.MASTER_PIC.DETAIL}/${body.id}`, method: "PUT", data: { name: body.name, status: body.status } }),
      invalidatesTags: ["Pic"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetPicsQuery, useCreatePicMutation, useGetPicByIdQuery, useUpdatePicMutation } = masterPicService;
