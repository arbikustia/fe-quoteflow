import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type {
  PaymentMethodCreatePayload,
  PaymentMethodCreateResponse,
  PaymentMethodData,
  PaymentMethodListParams,
  PaymentMethodListResponse,
} from "./MasterPaymentMethod.type";

/**
 * Map API payment method model to PaymentMethodData UI model.
 * @param {PaymentMethodListResponse["data"]["data"][number]} paymentMethod - Raw API payment method object
 * @returns {PaymentMethodData} Mapped payment method model
 */
export const _mapPaymentMethod = (
  paymentMethod: NonNullable<PaymentMethodListResponse["data"]>["data"][number],
): PaymentMethodData => ({
  id: paymentMethod.id,
  name: paymentMethod.name,
  description: paymentMethod.description ?? "",
  status: paymentMethod.status === 1 ? "active" : "inactive",
  createAt: paymentMethod.created_at ?? "",
  createBy: paymentMethod.created_by ?? "",
});

export const masterPaymentMethodApi = apiRtkClient.injectEndpoints({
  /**
   * Define endpoints for master payment method API
   * @param {object} builder - RTK Query endpoint builder
   * @returns {object} Endpoint definitions
   */
  endpoints: (builder) => ({
    /**
     * GET /api/payment-method/paged - Fetch paginated payment methods
     * @param {PaymentMethodListParams} params - Query parameters
     * @returns {Promise<PaymentMethodListResponse>} Paginated payment method list
     */
    getPaymentMethods: builder.query<PaymentMethodListResponse, PaymentMethodListParams>({
      /**
       * Configure the query for fetching payment methods
       * @param {PaymentMethodListParams} params - Query parameters
       * @returns {object} RTK Query configuration
       */
      query: (params) => ({
        url: "/api/payment-method/paged",
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: ["PaymentMethod"],
    }),
    /**
     * GET /api/payment-method/get-all-payment-method - Fetch all payment methods
     * @returns {Promise<PaymentMethodListResponse>} All payment methods list
     */
    getAllPaymentMethods: builder.query<PaymentMethodListResponse, void>({
      /**
       * Configure the query for fetching all payment methods
       * @returns {object} RTK Query configuration
       */
      query: () => ({
        url: "/api/payment-method/get-all-payment-method",
        method: "GET",
      }),
      providesTags: ["PaymentMethod"],
    }),
    /**
     * POST /api/payment-method - Create a new payment method
     * @param {PaymentMethodCreatePayload} body - Payment method creation payload
     * @returns {Promise<PaymentMethodCreateResponse>} Created payment method response
     */
    createPaymentMethod: builder.mutation<PaymentMethodCreateResponse, PaymentMethodCreatePayload>({
      /**
       * Configure the mutation for creating a payment method
       * @param {PaymentMethodCreatePayload} body - Payment method creation payload
       * @returns {object} RTK Query configuration
       */
      query: (body) => ({
        url: "/api/payment-method",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["PaymentMethod"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPaymentMethodsQuery,
  useGetAllPaymentMethodsQuery,
  useCreatePaymentMethodMutation,
} = masterPaymentMethodApi;
