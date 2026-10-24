import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type {
  ApiCustomer,
  CustomerCreatePayload,
  CustomerAllResponse,
  CustomerCreateResponse,
  CustomerData,
  CustomerDetailResponse,
  CustomerListParams,
  CustomerListResponse,
  CustomerUpdatePayload,
} from "@/modules/master-customer/MasterCustomer.type";

const CUSTOMER_TAG = "Customer";

/**
 * Map API customer model to UI model.
 * @param {ApiCustomer} customer - API customer model
 * @returns {CustomerData} Customer UI model
 */
export const mapCustomer = (customer: ApiCustomer): CustomerData => ({
  id: customer.id,
  name: customer.name,
  address: customer.address,
  phoneNumber: customer.phone_number,
  status: customer.status === 1 ? "active" : "inactive",
  createAt: customer.created_at,
  createBy: customer.created_by,
});

export const masterCustomerService = apiRtkClient.injectEndpoints({
  /**
   *
   * @param builder
   */
  endpoints: (builder) => ({
    getAllCustomers: builder.query<CustomerAllResponse, void>({
      query: () => ({ url: ENDPOINT.MASTER_CUSTOMER.ALL, method: "GET" }),
      providesTags: [CUSTOMER_TAG],
    }),
    getCustomers: builder.query<CustomerListResponse, CustomerListParams>({
      /**
       *
       * @param params
       */
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
    createCustomer: builder.mutation<
      CustomerCreateResponse,
      CustomerCreatePayload
    >({
      /**
       *
       * @param body
       */
      query: (body) => ({
        url: ENDPOINT.MASTER_CUSTOMER.CREATE,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [CUSTOMER_TAG],
    }),
    getCustomerById: builder.query<CustomerDetailResponse, string>({
      /**
       *
       * @param id
       */
      query: (id) => ({
        url: `${ENDPOINT.MASTER_CUSTOMER.DETAIL}/${id}`,
        method: "GET",
      }),
      providesTags: [CUSTOMER_TAG],
    }),
    updateCustomer: builder.mutation<
      CustomerCreateResponse,
      CustomerUpdatePayload
    >({
      /**
       *
       * @param body
       */
      query: (body) => ({
        url: `${ENDPOINT.MASTER_CUSTOMER.DETAIL}/${body.id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: [CUSTOMER_TAG],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllCustomersQuery,
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} = masterCustomerService;
