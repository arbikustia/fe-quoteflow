import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type {
  ApiOrderType,
  OrderTypeAllResponse,
  OrderTypeCreatePayload,
  OrderTypeCreateResponse,
  OrderTypeData,
  OrderTypeDetailResponse,
  OrderTypeListParams,
  OrderTypeListResponse,
  OrderTypeUpdatePayload,
} from "@/modules/master-order-type/MasterOrderType.type";

const ORDER_TYPE_TAG = "OrderType";

/**
 * Map API order type model to UI model.
 * @param {ApiOrderType} orderType - API order type model
 * @returns {OrderTypeData} Order type UI model
 */
export const mapOrderType = (orderType: ApiOrderType): OrderTypeData => ({
  id: orderType.id,
  name: orderType.name,
  isHandover: Boolean(orderType.is_handover),
  status: orderType.status === 1 ? "active" : "inactive",
  createAt: orderType.created_at,
  createBy: orderType.created_by ?? null,
});

export const masterOrderTypeService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrderTypes: builder.query<OrderTypeAllResponse, void>({
      query: () => ({ url: ENDPOINT.MASTER_ORDER_TYPE.ALL, method: "GET" }),
      providesTags: [ORDER_TYPE_TAG],
    }),
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
    createOrderType: builder.mutation<OrderTypeCreateResponse, OrderTypeCreatePayload>({
      query: (body) => ({
        url: ENDPOINT.MASTER_ORDER_TYPE.CREATE,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [ORDER_TYPE_TAG],
    }),
    getOrderTypeById: builder.query<OrderTypeDetailResponse, string>({
      query: (id) => ({
        url: `${ENDPOINT.MASTER_ORDER_TYPE.DETAIL}/${id}`,
        method: "GET",
      }),
      providesTags: [ORDER_TYPE_TAG],
    }),
    updateOrderType: builder.mutation<OrderTypeCreateResponse, OrderTypeUpdatePayload>({
      query: (body) => ({
        url: `${ENDPOINT.MASTER_ORDER_TYPE.DETAIL}/${body.id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: [ORDER_TYPE_TAG],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllOrderTypesQuery,
  useGetOrderTypesQuery,
  useCreateOrderTypeMutation,
  useGetOrderTypeByIdQuery,
  useUpdateOrderTypeMutation,
} = masterOrderTypeService;
