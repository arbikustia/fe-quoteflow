import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type { ApiRentalTransaction, OrderCreatePayload, OrderCreateResponse, OrderDetailResponse, OrderListParams, OrderListResponse, ProjectOrderCreatePayload, QuoteData } from "@/modules/order/Order.type";

const ORDER_TAG = "Order";

const mapOrder = (order: ApiRentalTransaction): QuoteData => ({
  id: order.id,
  name: order.event_name,
  startDate: order.start_at,
  endDate: order.end_at,
  location: order.address,
  category: "",
  selectedItems: order.rental_transaction_items.map((item) => item.item_name),
  qty: order.rental_transaction_items.reduce((total, item) => total + item.qty, 0),
  pph: order.grand_total,
  discount: 0,
  remark: "",
  grandTotal: order.grand_total,
  status: order.status,
  customerPhone: order.customer_phone,
});

export const orderService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrderListResponse, OrderListParams>({
      query: (params) => ({
        url: ENDPOINT.ORDER.PAGED,
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          Type: params.type,
          Status: params.status,
          StartDate: params.startDate,
          EndDate: params.endDate,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: [ORDER_TAG],
    }),
    getOrderById: builder.query<OrderDetailResponse, string>({
      query: (id) => ({
        url: `${ENDPOINT.ORDER.DETAIL}/${id}`,
        method: "GET",
      }),
      providesTags: [ORDER_TAG],
    }),
    createOrder: builder.mutation<OrderCreateResponse, OrderCreatePayload>({
      query: (body) => ({ url: ENDPOINT.ORDER.CREATE, method: "POST", data: body }),
      invalidatesTags: [ORDER_TAG],
    }),
    createProjectOrder: builder.mutation<OrderCreateResponse, ProjectOrderCreatePayload>({
      query: (body) => ({ url: ENDPOINT.ORDER.PROJECT_CREATE, method: "POST", data: body }),
      invalidatesTags: [ORDER_TAG],
    }),
  }),
  overrideExisting: false,
});

export const { useGetOrdersQuery, useGetOrderByIdQuery, useCreateOrderMutation, useCreateProjectOrderMutation } = orderService;
export { mapOrder };
