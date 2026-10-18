import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type {
  ApiPaymentMethod,
  PaymentMethodCreatePayload,
  PaymentMethodCreateResponse,
  PaymentMethodData,
  PaymentMethodDetailResponse,
  PaymentMethodListParams,
  PaymentMethodListResponse,
  PaymentMethodUpdatePayload,
} from "@/modules/master-payment-method/MasterPaymentMethod.type";

export type {
  ApiPaymentMethod,
  PaymentMethodCreatePayload,
  PaymentMethodCreateResponse,
  PaymentMethodDetailResponse,
  PaymentMethodListParams,
  PaymentMethodListResponse,
  PaymentMethodUpdatePayload,
};

/**
 * Map API payment method model to UI model.
 * @param {ApiPaymentMethod} item - API payment method
 * @returns {PaymentMethodData} UI payment method model
 */
export const mapPaymentMethod = (item: ApiPaymentMethod): PaymentMethodData => ({
  id: item.id,
  name: item.name,
  description: item.description,
  status: item.status === 1 ? "active" : "inactive",
  createAt: item.created_at,
  createBy: item.created_by ?? null,
});

export const masterPaymentMethodService = apiRtkClient.injectEndpoints({
  /**
   *
   * @param builder
   */
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<PaymentMethodListResponse, PaymentMethodListParams>({
      /**
       *
       * @param params
       */
      query: (params) => ({
        url: ENDPOINT.MASTER_PAYMENT_METHOD.PAGED,
        method: "GET",
        params: {
          PageNumber: params.PageNumber,
          PageSize: params.PageSize,
          SearchTerm: params.SearchTerm,
        },
      }),
      providesTags: ["PaymentMethod"],
    }),
    createPaymentMethod: builder.mutation<PaymentMethodCreateResponse, PaymentMethodCreatePayload>({
      /**
       *
       * @param body
       */
      query: (body) => ({
        url: ENDPOINT.MASTER_PAYMENT_METHOD.CREATE,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["PaymentMethod"],
    }),
    getPaymentMethodById: builder.query<PaymentMethodDetailResponse, string>({
      /**
       *
       * @param id
       */
      query: (id) => ({
        url: `${ENDPOINT.MASTER_PAYMENT_METHOD.DETAIL}/${id}`,
        method: "GET",
      }),
      providesTags: ["PaymentMethod"],
    }),
    updatePaymentMethod: builder.mutation<PaymentMethodCreateResponse, PaymentMethodUpdatePayload>({
      /**
       *
       * @param body
       */
      query: (body) => ({
        url: `${ENDPOINT.MASTER_PAYMENT_METHOD.DETAIL}/${body.id}`,
        method: "PUT",
        data: {
          name: body.name,
          description: body.description,
          status: body.status,
        },
      }),
      invalidatesTags: ["PaymentMethod"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPaymentMethodsQuery,
  useCreatePaymentMethodMutation,
  useGetPaymentMethodByIdQuery,
  useUpdatePaymentMethodMutation,
} = masterPaymentMethodService;
