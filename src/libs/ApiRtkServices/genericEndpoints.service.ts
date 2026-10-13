import { apiRtkClient } from "./apiRtkClient";

import type { ApiBaseData, GenericMutationArgs, GenericQueryArgs } from "@/types/api.type";

export const genericEndpointsService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getByUrl: builder.query<ApiBaseData, GenericQueryArgs>({
      query: (arg) => ({
        url: arg.url,
        method: "GET",
        params: arg.params,
      }),
    }),
    mutateByUrl: builder.mutation<ApiBaseData, GenericMutationArgs<ApiBaseData>>({
      query: (arg) => ({
        url: arg.url,
        method: "POST",
        data: arg.body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetByUrlQuery, useLazyGetByUrlQuery, useMutateByUrlMutation } = genericEndpointsService;
