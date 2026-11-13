import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constants/endpoint.constant";

import { buildMailHtmlTemplate } from "./mail-template";

import type { MailComposeValues } from "@/modules/mail/create/MailCreate.type";
import type {
  ApiEmailHistoryItem,
  EmailSenderListResponse,
  MailData,
  MailListParams,
  MailListResponse,
  MailSendResponse,
} from "@/modules/mail/Mail.type";

export { buildMailHtmlTemplate };

const MAIL_TAG = "Mail";

/**
 * Map API email-history item to UI mail model.
 * @param {ApiEmailHistoryItem} mail - API email-history item
 * @returns {MailData} Mail UI model
 */
export const mapMail = (mail: ApiEmailHistoryItem): MailData => ({
  id: mail.id,
  senderEmail: mail.sender_email ?? "",
  recipientEmail: mail.recipient_email ?? "",
  subject: mail.subject ?? "",
  status: mail.status === 1 ? "active" : "inactive",
  sentAt: mail.sent_at ?? "",
  createdAt: mail.created_at ?? "",
});

/**
 * Build multipart body for POST /api/email/send.
 * @param {MailComposeValues} values - Validated compose form values
 * @returns {FormData} Multipart form data
 */
export const buildMailSendFormData = (values: MailComposeValues): FormData => {
  const formData = new FormData();

  formData.append("senderId", values.senderId);
  formData.append("to", values.to);
  formData.append("subject", values.subject);
  formData.append("body", buildMailHtmlTemplate(values.body, values.template, values.quotation, values.invoice));
  formData.append("isHtml", "true");

  if (values.attachment) {
    formData.append("attachments", values.attachment, values.attachment.name);
  }

  return formData;
};

export const mailService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getMails: builder.query<MailListResponse, MailListParams>({
      query: (params) => ({
        url: ENDPOINT.MAIL.PAGED,
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: [MAIL_TAG],
    }),
    getMailSenders: builder.query<EmailSenderListResponse, void>({
      query: () => ({ url: ENDPOINT.MAIL.SENDERS, method: "GET" }),
      providesTags: [MAIL_TAG],
    }),
    sendMail: builder.mutation<MailSendResponse, FormData>({
      query: (body) => ({
        url: ENDPOINT.MAIL.SEND,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [MAIL_TAG],
    }),
  }),
  overrideExisting: false,
});

export const { useGetMailsQuery, useGetMailSendersQuery, useSendMailMutation } = mailService;
