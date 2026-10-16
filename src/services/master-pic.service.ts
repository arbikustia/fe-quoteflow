import ENDPOINT from "@/constant/endpoint.const";
import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";
import type { PicData } from "@/modules/master-pic/MasterPic.type";
import type { ApiEnvelope, ApiQueryParams, PaginatedResponse } from "@/types/api.type";

export type ApiPic = {
  readonly id: string;
  readonly name: string | null;
  readonly status: number;
  readonly created_by: string | null;
  readonly created_at: string | null;
  readonly updated_at: string | null;
};

export type PicListResponse = PaginatedResponse<ApiPic>;
export type PicDetailResponse = ApiEnvelope<ApiPic | ApiPic[] | null>;
export type PicCreateResponse = ApiEnvelope<ApiPic | null>;
export type PicListParams = ApiQueryParams;

export type PicCreatePayload = {
  readonly name: string;
  readonly status: number;
};

export type PicUpdatePayload = PicCreatePayload & {
  readonly id: string;
};

/** Map API PIC model to UI model. */
export const mapPic = (item: ApiPic): PicData => ({
  id: item.id,
  name: item.name ?? "",
  status: item.status === 1 ? "active" : "inactive",
  createAt: item.created_at ?? "",
  createBy: item.created_by ?? "",
});

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
