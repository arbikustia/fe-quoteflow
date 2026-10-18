import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type { AuthenticationPayload, AuthenticationResponse } from "@/app/auth/login-page/LoginPage.type";

export const authenticationService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    authenticate: builder.mutation<AuthenticationResponse, AuthenticationPayload>({
      query: (body) => ({ url: ENDPOINT.AUTHENTICATION, method: "POST", data: body }),
    }),
  }),
  overrideExisting: false,
});

export const { useAuthenticateMutation } = authenticationService;
