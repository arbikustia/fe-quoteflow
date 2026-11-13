import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constants/endpoint.constant";

import type {
  ReturnCreatePayload,
  ReturnCreateResponse,
  ReturnDetailResponse,
  ReturnListParams,
  ReturnListResponse,
  ReturnUpdateRequest,
} from "@/modules/item-return/ItemReturn.type";

const RENTAL_RETURN_TAG = "RentalReturn";

export const rentalReturnService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getRentalReturnsPaged: builder.query<ReturnListResponse, ReturnListParams>({
      query: (params) => ({
        url: ENDPOINT.RENTAL_RETURN.PAGED,
        method: "GET",
        params: {
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          searchTerm: params.searchTerm,
        },
      }),
      providesTags: [RENTAL_RETURN_TAG],
    }),
    getRentalReturnById: builder.query<ReturnDetailResponse, string>({
      query: (id) => ({ url: `${ENDPOINT.RENTAL_RETURN.DETAIL}/${id}`, method: "GET" }),
      providesTags: [RENTAL_RETURN_TAG],
    }),
    createRentalReturn: builder.mutation<ReturnCreateResponse, ReturnCreatePayload>({
      query: (body) => ({ url: ENDPOINT.RENTAL_RETURN.CREATE, method: "POST", data: body }),
      invalidatesTags: [RENTAL_RETURN_TAG],
    }),
    updateRentalReturn: builder.mutation<ReturnCreateResponse, ReturnUpdateRequest>({
      query: ({ id, body }) => ({ url: `${ENDPOINT.RENTAL_RETURN.UPDATE}/${id}`, method: "PUT", data: body }),
      invalidatesTags: [RENTAL_RETURN_TAG],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRentalReturnsPagedQuery,
  useGetRentalReturnByIdQuery,
  useLazyGetRentalReturnByIdQuery,
  useCreateRentalReturnMutation,
  useUpdateRentalReturnMutation,
} = rentalReturnService;
