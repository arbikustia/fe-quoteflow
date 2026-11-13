import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constants/endpoint.constant";

import type {
  OrderTypeCreatePayload,
  OrderTypeListParams,
  OrderTypeListResponse,
  OrderTypeMutationResponse,
  OrderTypeUpdatePayload,
} from "@/modules/master-data/master-order-type/MasterOrderType.type";

const ORDER_TYPE_TAG = "OrderType";

export const masterOrderTypeService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getOrderTypes: builder.query<OrderTypeListResponse, OrderTypeListParams>({
      query: (params) => ({
        url: ENDPOINT.MASTER_ORDER_TYPE.PAGED,
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: [ORDER_TYPE_TAG],
    }),
    getOrderTypeById: builder.query<OrderTypeMutationResponse, string>({
      query: (id) => ({ url: `${ENDPOINT.MASTER_ORDER_TYPE.DETAIL}/${id}`, method: "GET" }),
      providesTags: [ORDER_TYPE_TAG],
    }),
    createOrderType: builder.mutation<OrderTypeMutationResponse, OrderTypeCreatePayload>({
      query: (body) => ({ url: ENDPOINT.MASTER_ORDER_TYPE.CREATE, method: "POST", data: body }),
      invalidatesTags: [ORDER_TYPE_TAG],
    }),
    updateOrderType: builder.mutation<OrderTypeMutationResponse, OrderTypeUpdatePayload>({
      query: (body) => ({ url: `${ENDPOINT.MASTER_ORDER_TYPE.DETAIL}/${body.id}`, method: "PUT", data: body }),
      invalidatesTags: [ORDER_TYPE_TAG],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrderTypesQuery,
  useGetOrderTypeByIdQuery,
  useCreateOrderTypeMutation,
  useUpdateOrderTypeMutation,
} = masterOrderTypeService;
