import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";
import ENDPOINT from "@/constant/endpoint.const";
import type { ApiEnvelope, PaginatedResponse, ApiQueryParams } from "@/types/api.type";
import type { PaymentMethodData } from "@/modules/master-payment-method/MasterPaymentMethod.type";

export type ApiPaymentMethod = {
  readonly id: string;
  readonly name: string | null;
  readonly description: string | null;
  readonly status: number;
  readonly created_at: string | null;
  readonly updated_at: string | null;
  readonly created_by?: string | null;
};

export type PaymentMethodListResponse = PaginatedResponse<ApiPaymentMethod>;
export type PaymentMethodDetailResponse = ApiEnvelope<ApiPaymentMethod | ApiPaymentMethod[] | null>;
export type PaymentMethodCreateResponse = ApiEnvelope<ApiPaymentMethod | null>;

export type PaymentMethodListParams = ApiQueryParams;

export type PaymentMethodCreatePayload = {
  readonly name: string;
  readonly description: string;
  readonly status: number;
};

export type PaymentMethodUpdatePayload = PaymentMethodCreatePayload & {
  readonly id: string;
};

/**
 * Map API payment method model to UI model.
 * @param {ApiPaymentMethod} item - API payment method
 * @returns {PaymentMethodData} UI payment method model
 */
export const mapPaymentMethod = (item: ApiPaymentMethod): PaymentMethodData => ({
  id: item.id,
  name: item.name ?? "",
  description: item.description ?? "",
  status: item.status === 1 ? "active" : "inactive",
  createAt: item.created_at ?? "",
  createBy: item.created_by ?? "",
});

export const masterPaymentMethodService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<PaymentMethodListResponse, PaymentMethodListParams>({
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
      query: (body) => ({
        url: ENDPOINT.MASTER_PAYMENT_METHOD.CREATE,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["PaymentMethod"],
    }),
    getPaymentMethodById: builder.query<PaymentMethodDetailResponse, string>({
      query: (id) => ({
        url: `${ENDPOINT.MASTER_PAYMENT_METHOD.DETAIL}/${id}`,
        method: "GET",
      }),
      providesTags: ["PaymentMethod"],
    }),
    updatePaymentMethod: builder.mutation<PaymentMethodCreateResponse, PaymentMethodUpdatePayload>({
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
