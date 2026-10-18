import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type { AuthenticationPayload, AuthenticationResponse } from "@/app/auth/login-page/LoginPage.type";
import ENDPOINT from "@/constant/endpoint.const";

export const authenticationService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    authenticate: builder.mutation<AuthenticationResponse, AuthenticationPayload>({
      query: (body) => ({ url: ENDPOINT.AUTHENTICATION, method: "POST", data: body }),
    }),
  }),
  overrideExisting: false,
});

export const { useAuthenticateMutation } = authenticationService;
