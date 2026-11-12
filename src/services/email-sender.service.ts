import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type {
  EmailSenderCreatePayload,
  EmailSenderListParams,
  EmailSenderListResponse,
  EmailSenderMutationResponse,
  EmailSenderUpdatePayload,
} from "@/modules/master-data/master-email-sender/MasterEmailSender.type";

import ENDPOINT from "@/constants/endpoint.constant";

const EMAIL_SENDER_TAG = "EmailSender";

export const emailSenderService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getEmailSenders: builder.query<EmailSenderListResponse, EmailSenderListParams>({
      query: (params) => ({
        url: ENDPOINT.MASTER_EMAIL_SENDER.PAGED,
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: [EMAIL_SENDER_TAG],
    }),
    getEmailSenderById: builder.query<EmailSenderMutationResponse, string>({
      query: (id) => ({ url: `${ENDPOINT.MASTER_EMAIL_SENDER.BY_ID}/${id}`, method: "GET" }),
      providesTags: [EMAIL_SENDER_TAG],
    }),
    createEmailSender: builder.mutation<EmailSenderMutationResponse, EmailSenderCreatePayload>({
      query: (body) => ({ url: ENDPOINT.MASTER_EMAIL_SENDER.CREATE, method: "POST", data: body }),
      invalidatesTags: [EMAIL_SENDER_TAG],
    }),
    updateEmailSender: builder.mutation<EmailSenderMutationResponse, EmailSenderUpdatePayload>({
      query: ({ id, ...body }) => ({ url: `${ENDPOINT.MASTER_EMAIL_SENDER.DETAIL}/${id}`, method: "PUT", data: body }),
      invalidatesTags: [EMAIL_SENDER_TAG],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEmailSendersQuery,
  useGetEmailSenderByIdQuery,
  useCreateEmailSenderMutation,
  useUpdateEmailSenderMutation,
} = emailSenderService;
