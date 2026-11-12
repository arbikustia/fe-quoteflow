import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type {
  PaymentMethodCreatePayload,
  PaymentMethodListParams,
  PaymentMethodListResponse,
  PaymentMethodMutationResponse,
  PaymentMethodUpdatePayload,
} from "@/modules/master-data/master-payment-method/MasterPaymentMethod.type";

import ENDPOINT from "@/constants/endpoint.constant";

const PAYMENT_METHOD_TAG = "PaymentMethod";

export const masterPaymentMethodService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<PaymentMethodListResponse, PaymentMethodListParams>({
      query: (params) => ({
        url: ENDPOINT.MASTER_PAYMENT_METHOD.PAGED,
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: [PAYMENT_METHOD_TAG],
    }),
    createPaymentMethod: builder.mutation<PaymentMethodMutationResponse, PaymentMethodCreatePayload>({
      query: (body) => ({ url: ENDPOINT.MASTER_PAYMENT_METHOD.CREATE, method: "POST", data: body }),
      invalidatesTags: [PAYMENT_METHOD_TAG],
    }),
    updatePaymentMethod: builder.mutation<PaymentMethodMutationResponse, PaymentMethodUpdatePayload>({
      query: ({ id, ...body }) => ({ url: `${ENDPOINT.MASTER_PAYMENT_METHOD.DETAIL}/${id}`, method: "PUT", data: body }),
      invalidatesTags: [PAYMENT_METHOD_TAG],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPaymentMethodsQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
} = masterPaymentMethodService;
