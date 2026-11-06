import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import { MAIL_CONFIG } from "@/modules/mail/Mail.config";
import type {
  ApiMail,
  EmailSenderListResponse,
  MailData,
  MailListParams,
  MailListResponse,
  MailSendResponse,
  MailTemplate,
} from "@/modules/mail/Mail.type";

import { buildMailHtmlTemplate } from "./mail-template";

import ENDPOINT from "@/constants/endpoint.constant";

export { buildMailHtmlTemplate };

const MAIL_TAG = "Mail";

/**
 * Map API mail model to UI model.
 * @param {ApiMail} mail - API mail model
 * @returns {MailData} Mail UI model
 */
export const mapMail = (mail: ApiMail): MailData => ({
  id: mail.id,
  recipient: mail.recipient,
  subject: mail.subject,
  body: mail.body ?? "",
  status: mail.status === 1 ? "active" : "inactive",
  createAt: mail.created_at ?? "",
  createBy: mail.created_by ?? "",
});

/**
 * Build multipart body for POST /api/email/send.
 * @param {string} senderId - Selected email sender id
 * @param {string} to - Recipient address
 * @param {string} subject - Mail subject
 * @param {string} body - Mail body
 * @param {File} [attachment] - Optional PDF attachment
 * @param {MailTemplate} [template] - Selected mail template
 * @returns {FormData} Multipart form data
 */
export const buildMailSendFormData = (
  senderId: string,
  to: string,
  subject: string,
  body: string,
  attachment?: File,
  template: MailTemplate = MAIL_CONFIG.DEFAULT_TEMPLATE,
): FormData => {
  const formData = new FormData();

  formData.append("senderId", senderId);
  formData.append("to", to);
  formData.append("subject", subject);
  formData.append("body", buildMailHtmlTemplate(body, template));
  formData.append("isHtml", "true");

  if (attachment) {
    formData.append("attachments", attachment);
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
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: [MAIL_TAG],
    }),
  }),
  overrideExisting: false,
});

export const { useGetMailsQuery, useGetMailSendersQuery, useSendMailMutation } = mailService;
