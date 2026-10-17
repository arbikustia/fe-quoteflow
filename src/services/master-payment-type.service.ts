import ENDPOINT from "@/constant/endpoint.const";
import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";
import type { PaymentTypeData } from "@/modules/master-payment-type/MasterPaymentType.type";
import type { ApiEnvelope, ApiQueryParams, PaginatedResponse } from "@/types/api.type";

export type ApiPaymentType = {
  readonly id: string;
  readonly name: string | null;
  readonly status: number;
  readonly created_at: string | null;
  readonly updated_at: string | null;
  readonly created_by?: string | null;
};

export type PaymentTypeListResponse = PaginatedResponse<ApiPaymentType>;
export type PaymentTypeDetailResponse = ApiEnvelope<ApiPaymentType | ApiPaymentType[] | null>;
export type PaymentTypeCreateResponse = ApiEnvelope<ApiPaymentType | null>;
export type PaymentTypeListParams = ApiQueryParams;

export type PaymentTypeCreatePayload = {
  readonly name: string;
  readonly status: number;
};

export type PaymentTypeUpdatePayload = PaymentTypeCreatePayload & {
  readonly id: string;
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
  endpoints: (builder) => ({
    getPaymentTypes: builder.query<PaymentTypeListResponse, PaymentTypeListParams>({
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
      query: (body) => ({ url: ENDPOINT.MASTER_PAYMENT_TYPE.CREATE, method: "POST", data: body }),
      invalidatesTags: ["PaymentType"],
    }),
    getPaymentTypeById: builder.query<PaymentTypeDetailResponse, string>({
      query: (id) => ({ url: `${ENDPOINT.MASTER_PAYMENT_TYPE.DETAIL}/${id}`, method: "GET" }),
      providesTags: ["PaymentType"],
    }),
    updatePaymentType: builder.mutation<PaymentTypeCreateResponse, PaymentTypeUpdatePayload>({
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
