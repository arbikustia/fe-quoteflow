import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type {
  CustomerCreatePayload,
  CustomerCreateResponse,
  CustomerData,
  CustomerListParams,
  CustomerListResponse,
} from "./MasterCustomer.type";

/**
 * Map API customer model to CustomerData UI model.
 * @param {CustomerListResponse["data"]["data"][number]} customer - Raw API customer object
 * @returns {CustomerData} Mapped customer model
 */
export const _mapCustomer = (
  customer: CustomerListResponse["data"]["data"][number],
): CustomerData => ({
  id: customer.id,
  name: customer.name,
  address: customer.address ?? "",
  phoneNumber: customer.phone_number ?? "",
  status: customer.status === 1 ? "active" : "inactive",
  createAt: customer.created_at ?? "",
  createBy: customer.created_by ?? "",
});

export const masterCustomerApi = apiRtkClient.injectEndpoints({
  /**
   * Define endpoints for master customer API
   * @param {object} builder - RTK Query endpoint builder
   * @returns {object} Endpoint definitions
   */
  endpoints: (builder) => ({
    /**
     * GET /api/customer/paged - Fetch paginated customers
     * @param {CustomerListParams} params - Query parameters
     * @returns {Promise<CustomerListResponse>} Paginated customer list
     */
    getCustomers: builder.query<CustomerListResponse, CustomerListParams>({
      /**
       * Configure the query for fetching customers
       * @param {CustomerListParams} params - Query parameters
       * @returns {object} RTK Query configuration
       */
      query: (params) => ({
        url: "/api/customer/paged",
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: ["Customer"],
    }),
    /**
     * POST /api/customer - Create a new customer
     * @param {CustomerCreatePayload} body - Customer creation payload
     * @returns {Promise<CustomerCreateResponse>} Created customer response
     */
    createCustomer: builder.mutation<CustomerCreateResponse, CustomerCreatePayload>({
      /**
       * Configure the mutation for creating a customer
       * @param {CustomerCreatePayload} body - Customer creation payload
       * @returns {object} RTK Query configuration
       */
      query: (body) => ({
        url: "/api/customer",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Customer"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetCustomersQuery, useCreateCustomerMutation } = masterCustomerApi;

