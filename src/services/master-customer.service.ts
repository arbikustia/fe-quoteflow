import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type {
  CustomerAllResponse,
  CustomerCreatePayload,
  CustomerListParams,
  CustomerListResponse,
  CustomerMutationResponse,
  CustomerUpdatePayload,
} from "@/modules/master-data/master-customer/MasterCustomer.type";

import ENDPOINT from "@/constants/endpoint.constant";

const CUSTOMER_TAG = "Customer";

export const masterCustomerService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomers: builder.query<CustomerAllResponse, void>({
      query: () => ({ url: ENDPOINT.MASTER_CUSTOMER.ALL, method: "GET" }),
      providesTags: [CUSTOMER_TAG],
    }),
    getCustomers: builder.query<CustomerListResponse, CustomerListParams>({
      query: (params) => ({
        url: ENDPOINT.MASTER_CUSTOMER.PAGED,
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: [CUSTOMER_TAG],
    }),
    getCustomerById: builder.query<CustomerMutationResponse, string>({
      query: (id) => ({ url: `${ENDPOINT.MASTER_CUSTOMER.DETAIL}/${id}`, method: "GET" }),
      providesTags: [CUSTOMER_TAG],
    }),
    createCustomer: builder.mutation<CustomerMutationResponse, CustomerCreatePayload>({
      query: (body) => ({ url: ENDPOINT.MASTER_CUSTOMER.CREATE, method: "POST", data: body }),
      invalidatesTags: [CUSTOMER_TAG],
    }),
    updateCustomer: builder.mutation<CustomerMutationResponse, CustomerUpdatePayload>({
      query: (body) => ({ url: `${ENDPOINT.MASTER_CUSTOMER.DETAIL}/${body.id}`, method: "PUT", data: body }),
      invalidatesTags: [CUSTOMER_TAG],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllCustomersQuery,
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} = masterCustomerService;
