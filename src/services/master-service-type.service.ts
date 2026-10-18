import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type { ServiceTypeCreatePayload, ServiceTypeCreateResponse, ServiceTypeData, ServiceTypeListParams, ServiceTypeListResponse, ServiceTypeUpdatePayload } from "@/modules/master-service-type/MasterServiceType.type";

/**
 * Map API service type model to UI model.
 * @param serviceType
 */
export const mapServiceType = (serviceType: ServiceTypeListResponse["data"][number]): ServiceTypeData => ({
  id: serviceType.id,
  name: serviceType.name,
  price: serviceType.price,
  isActive: serviceType.is_active,
  status: serviceType.status === 1 ? "active" : "inactive",
  createAt: serviceType.created_at ?? "",
  createBy: serviceType.created_by ?? "",
});

export const masterServiceTypeService = apiRtkClient.injectEndpoints({
  /**
   *
   * @param builder
   */
  endpoints: (builder) => ({
    getServiceTypes: builder.query<ServiceTypeListResponse, ServiceTypeListParams>({ /**
     *
     * @param params
     */
    query: (params) => ({ url: ENDPOINT.MASTER_SERVICE_TYPE.PAGED, method: "GET", params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm } }), providesTags: ["ServiceType"] }),
    createServiceType: builder.mutation<ServiceTypeCreateResponse, ServiceTypeCreatePayload>({ /**
     *
     * @param body
     */
    query: (body) => ({ url: ENDPOINT.MASTER_SERVICE_TYPE.CREATE, method: "POST", data: body }), invalidatesTags: ["ServiceType"] }),
    updateServiceType: builder.mutation<ServiceTypeCreateResponse, ServiceTypeUpdatePayload>({
      /**
       *
       * @param body
       */
      query: (body) => ({
        url: `${ENDPOINT.MASTER_SERVICE_TYPE.CREATE}/${body.id}`,
        method: "PUT",
        data: { name: body.name, price: body.price, status: body.status },
      }),
      invalidatesTags: ["ServiceType"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetServiceTypesQuery, useCreateServiceTypeMutation, useUpdateServiceTypeMutation } = masterServiceTypeService;
