import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";
import type { CustomerCreatePayload, CustomerCreateResponse, CustomerData, CustomerListParams, CustomerListResponse } from "@/modules/master-customer/MasterCustomer.type";

/** Map API customer model to UI model. */
export const mapCustomer = (customer: CustomerListResponse["data"]["data"][number]): CustomerData => ({
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
    getCustomers: builder.query<CustomerListResponse, CustomerListParams>({ query: (params) => ({ url: "/api/customer/paged", method: "GET", params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm } }), providesTags: ["Customer"] }),
    createCustomer: builder.mutation<CustomerCreateResponse, CustomerCreatePayload>({ query: (body) => ({ url: "/api/customer", method: "POST", data: body }), invalidatesTags: ["Customer"] }),
  }),
  overrideExisting: false,
});

export const { useGetCustomersQuery, useCreateCustomerMutation } = masterCustomerService;
