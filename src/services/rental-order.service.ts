import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constants/endpoint.constant";
import type { ApiRentalOrder, DashboardRentalOrderParams, DashboardRentalOrderResponse, RentalOrderListParams, RentalOrderListResponse, RentalOrderResponse, RentalOrderUpdatePayload, RentalOrderUpdateResponse, ReportOrderData } from "@/modules/report/Report.type";

const RENTAL_ORDER_TAG = "RentalOrder";

/**
 * Map API rental order to report table row.
 * @param {ApiRentalOrder} order - API rental order
 * @returns {ReportOrderData} Mapped report order data
 */
export const mapRentalOrder = (order: ApiRentalOrder): ReportOrderData => {
  const transaction = order.invoice?.quotation?.transaction;

  return {
    id: order.id,
    orderNo: order.order_no,
    transactionId: order.transaction_id,
    invoiceId: order.invoice_id,
    quotationId: order.quotation_id,
    invoiceNo: order.invoice?.invoice_no ?? "",
    notes: order.notes ?? "",
    rawOrderDate: order.order_date,
    customerName: transaction?.customer_name ?? transaction?.customer?.name ?? "",
    customerPhone: transaction?.customer_phone ?? transaction?.customer?.phone_number ?? "",
    eventName: transaction?.event_name ?? "",
    address: transaction?.address ?? transaction?.customer?.address ?? "",
    orderDate: order.order_date,
    startDate: transaction?.start_at ?? "",
    endDate: transaction?.end_at ?? "",
    grandTotal: transaction?.grand_total ?? 0,
    status: order.status,
    statusLabel: order.status === 1 ? "active" : "inactive",
    serviceTypeName: transaction?.service_type_name ?? "",
    orderTypeName: transaction?.order_type_name ?? "",
  };
};

export const rentalOrderService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getRentalOrderOptions: builder.query<RentalOrderResponse, void>({
      query: () => ({ url: ENDPOINT.RENTAL_ORDER.LIST, method: "GET" }),
      providesTags: [RENTAL_ORDER_TAG],
    }),
    getRentalOrders: builder.query<RentalOrderListResponse, RentalOrderListParams>({
      query: (params) => ({
        url: ENDPOINT.RENTAL_ORDER.PAGED,
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: [RENTAL_ORDER_TAG],
    }),
    getDashboardRentalOrders: builder.query<DashboardRentalOrderResponse, DashboardRentalOrderParams>({
      query: (params) => ({
        url: ENDPOINT.RENTAL_ORDER.DASHBOARD,
        method: "GET",
        params: {
          dateFrom: params.dateFrom,
          dateTo: params.dateTo,
        },
      }),
      providesTags: [RENTAL_ORDER_TAG],
    }),
    updateRentalOrder: builder.mutation<RentalOrderUpdateResponse, RentalOrderUpdatePayload & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `${ENDPOINT.RENTAL_ORDER.LIST}/${id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: [RENTAL_ORDER_TAG],
    }),
  }),
  overrideExisting: false,
});

export const { useGetRentalOrdersQuery, useGetRentalOrderOptionsQuery, useGetDashboardRentalOrdersQuery, useUpdateRentalOrderMutation } = rentalOrderService;
