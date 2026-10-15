import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type {
  ApiCustomer,
  CustomerCreatePayload,
  CustomerCreateResponse,
  CustomerData,
  CustomerListParams,
  CustomerListResponse,
} from "@/modules/master-customer/MasterCustomer.type";

const CUSTOMER_TAG = "Customer";

/**
 * Map API customer model to UI model.
 * @param {ApiCustomer} customer - API customer model
 * @returns {CustomerData} Customer UI model
 */
export const mapCustomer = (
  customer: ApiCustomer,
): CustomerData => ({
  id: customer.id,
  name: customer.name,
  address: customer.address ?? "",
  phoneNumber: customer.phone_number ?? "",
  status: customer.status === 1 ? "active" : "inactive",
  createAt: customer.created_at ?? "",
  createBy: customer.created_by ?? "",
});

export const masterCustomerService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<CustomerListResponse, CustomerListParams>({
      query: (params) => ({
        url: "/api/customer/paged",
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: [CUSTOMER_TAG],
    }),
    createCustomer: builder.mutation<
      CustomerCreateResponse,
      CustomerCreatePayload
    >({
      query: (body) => ({ url: "/api/customer", method: "POST", data: body }),
      invalidatesTags: [CUSTOMER_TAG],
    }),
  }),
  overrideExisting: false,
});

export const { useGetCustomersQuery, useCreateCustomerMutation } =
  masterCustomerService;
