import { createApi } from "@reduxjs/toolkit/query/react";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";

import apiClient from "@/libs/api/ApiClient/ApiClient";

import type { ApiBaseData, ApiError } from "@/types/api.type";

/**
 * Execute an Axios request for RTK Query.
 * @param {AxiosRequestConfig} requestConfig - Axios request configuration
 * @returns {Promise<{ data: ApiBaseData } | { error: ApiError }>} RTK Query result
 */
const axiosBaseQuery = async (
  requestConfig: AxiosRequestConfig,
): Promise<{ data: ApiBaseData } | { error: ApiError }> => {
  try {
    const response = await apiClient.request<ApiBaseData>(requestConfig);

    return { data: response.data };
  } catch (error) {
    if (
      axios.isAxiosError<{ readonly messages: string[] | string | null }>(error)
    ) {
      return {
        error: {
          status: error.response?.status ?? 0,
          data: error.response?.data.messages ?? error.message,
        },
      };
    }

    return { error: { status: 0, data: "Request failed" } };
  }
};

export const apiRtkClient = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery,
  tagTypes: [
    "Customer",
    "Category",
    "Item",
    "Role",
    "Voucher",
    "Project",
    "ServiceType",
    "PaymentMethod",
    "PaymentType",
    "Pic",
    "User",
  ],
  endpoints: () => ({}),
});
