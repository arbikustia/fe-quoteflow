import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type {
  ApiPaymentType,
  PaymentTypeCreatePayload,
  PaymentTypeCreateResponse,
  PaymentTypeData,
  PaymentTypeDetailResponse,
  PaymentTypeListParams,
  PaymentTypeListResponse,
  PaymentTypeUpdatePayload,
} from "@/modules/master-payment-type/MasterPaymentType.type";

export type {
  ApiPaymentType,
  PaymentTypeCreatePayload,
  PaymentTypeCreateResponse,
  PaymentTypeDetailResponse,
  PaymentTypeListParams,
  PaymentTypeListResponse,
  PaymentTypeUpdatePayload,
};

/**
 * Map API payment type model to UI model.
 * @param {ApiPaymentType} item - API payment type
 * @returns {PaymentTypeData} UI payment type
 */
export const mapPaymentType = (item: ApiPaymentType): PaymentTypeData => ({
  id: item.id,
  name: item.name,
  status: item.status === 1 ? "active" : "inactive",
  createAt: item.created_at,
  createBy: item.created_by ?? null,
});

export const masterPaymentTypeService = apiRtkClient.injectEndpoints({
  /**
   *
   * @param builder
   */
  endpoints: (builder) => ({
    getPaymentTypes: builder.query<PaymentTypeListResponse, PaymentTypeListParams>({
      /**
       *
       * @param params
       */
      query: (params) => ({
        url: ENDPOINT.MASTER_PAYMENT_TYPE.PAGED,
        method: "GET",
        params: {
          PageNumber: params.PageNumber,
          PageSize: params.PageSize,
          SearchTerm: params.SearchTerm,
        },
      }),
      providesTags: ["PaymentType"],
    }),
    createPaymentType: builder.mutation<PaymentTypeCreateResponse, PaymentTypeCreatePayload>({
      /**
       *
       * @param body
       */
      query: (body) => ({ url: ENDPOINT.MASTER_PAYMENT_TYPE.CREATE, method: "POST", data: body }),
      invalidatesTags: ["PaymentType"],
    }),
    getPaymentTypeById: builder.query<PaymentTypeDetailResponse, string>({
      /**
       *
       * @param id
       */
      query: (id) => ({ url: `${ENDPOINT.MASTER_PAYMENT_TYPE.DETAIL}/${id}`, method: "GET" }),
      providesTags: ["PaymentType"],
    }),
    updatePaymentType: builder.mutation<PaymentTypeCreateResponse, PaymentTypeUpdatePayload>({
      /**
       *
       * @param body
       */
      query: (body) => ({
        url: `${ENDPOINT.MASTER_PAYMENT_TYPE.DETAIL}/${body.id}`,
        method: "PUT",
        data: { name: body.name, status: body.status },
      }),
      invalidatesTags: ["PaymentType"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPaymentTypesQuery,
  useCreatePaymentTypeMutation,
  useGetPaymentTypeByIdQuery,
  useUpdatePaymentTypeMutation,
} = masterPaymentTypeService;
