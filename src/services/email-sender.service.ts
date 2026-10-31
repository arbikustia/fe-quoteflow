import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type { EmailSenderAllResponse, EmailSenderListParams, EmailSenderListResponse, EmailSenderMutationResponse, EmailSenderPayload } from "@/modules/email-sender/EmailSender.type";

const EMAIL_SENDER_TAG = "EmailSender";

export const emailSenderService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getEmailSenders: builder.query<EmailSenderListResponse, EmailSenderListParams>({
      query: ({ pageNumber, pageSize, searchTerm }) => ({ url: ENDPOINT.MASTER_EMAIL_SENDER.PAGED, method: "GET", params: { PageNumber: pageNumber, PageSize: pageSize, SearchTerm: searchTerm } }),
      providesTags: [EMAIL_SENDER_TAG],
    }),
    getAllEmailSenders: builder.query<EmailSenderAllResponse, void>({
      query: () => ({ url: ENDPOINT.MASTER_EMAIL_SENDER.ALL, method: "GET" }),
      providesTags: [EMAIL_SENDER_TAG],
    }),
    createEmailSender: builder.mutation<EmailSenderMutationResponse, EmailSenderPayload>({
      query: (body) => ({ url: ENDPOINT.MASTER_EMAIL_SENDER.CREATE, method: "POST", data: { ...body, status: 1 } }),
      invalidatesTags: [EMAIL_SENDER_TAG],
    }),
    updateEmailSender: builder.mutation<EmailSenderMutationResponse, EmailSenderPayload & { id: string }>({
      query: ({ id, ...body }) => ({ url: `${ENDPOINT.MASTER_EMAIL_SENDER.DETAIL}/${id}`, method: "PUT", data: body }),
      invalidatesTags: [EMAIL_SENDER_TAG],
    }),
  }),
  overrideExisting: false,
});

export const { useGetEmailSendersQuery, useGetAllEmailSendersQuery, useCreateEmailSenderMutation, useUpdateEmailSenderMutation } = emailSenderService;
