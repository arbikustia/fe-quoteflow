import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type { ChecklistCreatePayload, ChecklistCreateResponse, ChecklistDetailResponse, ChecklistListParams, ChecklistListResponse, ChecklistUpdateRequest } from "@/modules/item-checklist/ItemChecklist.type";

export const rentalChecklistService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getRentalChecklists: builder.query<ChecklistListResponse, ChecklistListParams>({
      query: (params) => ({ url: ENDPOINT.RENTAL_CHECKLIST.PAGED, method: "GET", params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm } }),
      providesTags: ["RentalChecklist"],
    }),
    getRentalChecklistById: builder.query<ChecklistDetailResponse, string>({
      query: (id) => ({ url: `${ENDPOINT.RENTAL_CHECKLIST.DETAIL}/${id}`, method: "GET" }),
      providesTags: ["RentalChecklist"],
    }),
    createRentalChecklist: builder.mutation<ChecklistCreateResponse, ChecklistCreatePayload>({
      query: (body) => ({ url: ENDPOINT.RENTAL_CHECKLIST.CREATE, method: "POST", data: body }),
      invalidatesTags: ["RentalChecklist"],
    }),
    updateRentalChecklist: builder.mutation<ChecklistCreateResponse, ChecklistUpdateRequest>({
      query: ({ id, body }) => ({ url: `${ENDPOINT.RENTAL_CHECKLIST.UPDATE}/${id}`, method: "PUT", data: body }),
      invalidatesTags: ["RentalChecklist"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetRentalChecklistsQuery, useGetRentalChecklistByIdQuery, useLazyGetRentalChecklistByIdQuery, useCreateRentalChecklistMutation, useUpdateRentalChecklistMutation } = rentalChecklistService;
