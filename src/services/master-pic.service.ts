import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type {
  PicAllResponse,
  PicCreatePayload,
  PicListParams,
  PicListResponse,
  PicMutationResponse,
  PicUpdatePayload,
} from "@/modules/master-data/master-pic/MasterPic.type";

import ENDPOINT from "@/constants/endpoint.constant";

const PIC_TAG = "Pic";

export const masterPicService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getPics: builder.query<PicListResponse, PicListParams>({
      query: (params) => ({
        url: ENDPOINT.MASTER_PIC.PAGED,
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: [PIC_TAG],
    }),
    getAllPics: builder.query<PicAllResponse, void>({
      query: () => ({ url: ENDPOINT.MASTER_PIC.ALL, method: "GET" }),
      providesTags: [PIC_TAG],
    }),
    createPic: builder.mutation<PicMutationResponse, PicCreatePayload>({
      query: (body) => ({ url: ENDPOINT.MASTER_PIC.CREATE, method: "POST", data: body }),
      invalidatesTags: [PIC_TAG],
    }),
    updatePic: builder.mutation<PicMutationResponse, PicUpdatePayload>({
      query: ({ id, ...body }) => ({ url: `${ENDPOINT.MASTER_PIC.DETAIL}/${id}`, method: "PUT", data: body }),
      invalidatesTags: [PIC_TAG],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPicsQuery,
  useGetAllPicsQuery,
  useCreatePicMutation,
  useUpdatePicMutation,
} = masterPicService;
