import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type {
  PaymentTypeCreatePayload,
  PaymentTypeCreateResponse,
  PaymentTypeData,
  PaymentTypeListParams,
  PaymentTypeListResponse,
} from "./MasterPaymentType.type";

/**
 * Map API payment type model to PaymentTypeData UI model.
 * @param {PaymentTypeListResponse["data"][number]} paymentType - Raw API payment type object
 * @returns {PaymentTypeData} Mapped payment type model
 */
export const _mapPaymentType = (
  paymentType: NonNullable<PaymentTypeListResponse["data"]>["data"][number],
): PaymentTypeData => ({
  id: paymentType.id,
  name: paymentType.name,
  status: paymentType.status === 1 ? "active" : "inactive",
  createAt: paymentType.created_at ?? "",
  createBy: paymentType.created_by ?? "",
});

export const masterPaymentTypeApi = apiRtkClient.injectEndpoints({
  /**
   * Define endpoints for master payment type API
   * @param {object} builder - RTK Query endpoint builder
   * @returns {object} Endpoint definitions
   */
  endpoints: (builder) => ({
    /**
     * GET /api/payment-type/paged - Fetch paginated payment types
     * @param {PaymentTypeListParams} params - Query parameters
     * @returns {Promise<PaymentTypeListResponse>} Paginated payment type list
     */
    getPaymentTypes: builder.query<PaymentTypeListResponse, PaymentTypeListParams>({
      /**
       * Configure the query for fetching payment types
       * @param {PaymentTypeListParams} params - Query parameters
       * @returns {object} RTK Query configuration
       */
      query: (params) => ({
        url: "/api/payment-type/paged",
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: ["PaymentType"],
    }),
    /**
     * POST /api/payment-type - Create a new payment type
     * @param {PaymentTypeCreatePayload} body - Payment type creation payload
     * @returns {Promise<PaymentTypeCreateResponse>} Created payment type response
     */
    createPaymentType: builder.mutation<PaymentTypeCreateResponse, PaymentTypeCreatePayload>({
      /**
       * Configure the mutation for creating a payment type
       * @param {PaymentTypeCreatePayload} body - Payment type creation payload
       * @returns {object} RTK Query configuration
       */
      query: (body) => ({
        url: "/api/payment-type",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["PaymentType"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetPaymentTypesQuery, useCreatePaymentTypeMutation } = masterPaymentTypeApi;


