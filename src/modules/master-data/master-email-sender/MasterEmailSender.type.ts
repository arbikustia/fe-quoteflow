import type { ChangeEvent } from "react";
import { z } from "zod";

import { formatIndonesianDateTime } from "@/utils/date.helpers";

import type { ApiEnvelope, PaginatedResponse } from "@/types/api.type";

import { EMAIL_SENDER_ACTIVE_STATUS, EMAIL_SENDER_EMPTY_DATE_VALUE } from "./MasterEmailSender.config";

/** Sender status as shown in the UI. */
export type EmailSenderStatus = "active" | "inactive";

/** Yes / no flag as shown in the UI. */
export type EmailSenderFlag = "yes" | "no";

/** API status code (`1` = active) mapped to the UI status. */
const EmailSenderStatusSchema = z
  .number()
  .catch(0)
  .transform((status): EmailSenderStatus => (status === EMAIL_SENDER_ACTIVE_STATUS ? "active" : "inactive"));

/** API boolean mapped to the UI flag; a missing value reads as "no". */
const EmailSenderFlagSchema = z
  .boolean()
  .catch(false)
  .transform((value): EmailSenderFlag => (value ? "yes" : "no"));

/** API timestamp formatted for display, with a placeholder when absent. */
const EmailSenderDateSchema = z
  .string()
  .nullish()
  .transform((value): string => (value ? formatIndonesianDateTime(value) : EMAIL_SENDER_EMPTY_DATE_VALUE));

/** Sender row from `GET /api/email-sender/paged`, normalized for display. */
export const EmailSenderListItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    smtp_host: z.string(),
    smtp_port: z.number(),
    enable_ssl: EmailSenderFlagSchema,
    is_default: EmailSenderFlagSchema,
    status: EmailSenderStatusSchema,
    created_at: EmailSenderDateSchema,
  })
  .transform((sender) => ({
    id: sender.id,
    name: sender.name,
    email: sender.email,
    smtpServer: `${sender.smtp_host}:${sender.smtp_port}`,
    enableSsl: sender.enable_ssl,
    isDefault: sender.is_default,
    status: sender.status,
    createdAt: sender.created_at,
  }));

/** Raw email sender record as returned by the API. */
export type ApiEmailSender = z.input<typeof EmailSenderListItemSchema> & {
  smtp_username: string;
  updated_at?: string | null;
};

/** Sender row ready for the list view. */
export type EmailSenderData = z.output<typeof EmailSenderListItemSchema>;

/** Paged email sender list response. */
export type EmailSenderListResponse = PaginatedResponse<ApiEmailSender>;

/** Create / update / detail response for a single sender. */
export type EmailSenderMutationResponse = ApiEnvelope<ApiEmailSender | null>;

/** Create email sender request body. */
export type EmailSenderCreatePayload = {
  name: string;
  email: string;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  enable_ssl: boolean;
  is_default: boolean;
  status: number;
};

/** Update email sender request body; an empty password keeps the current one. */
export type EmailSenderUpdatePayload = EmailSenderCreatePayload & {
  id: string;
};

/** Paged email sender list query params. */
export type EmailSenderListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

/** Which part of the list view is rendered. */
export type EmailSenderListStatus = "loading" | "error" | "missing" | "empty" | "ready";

/** List statuses that render a message instead of rows. */
export type EmailSenderListMessageStatus = Exclude<EmailSenderListStatus, "loading" | "ready">;

/** Normalized paged list data. */
export type EmailSenderListView = {
  listStatus: EmailSenderListStatus;
  emailSenders: EmailSenderData[];
  totalPages: number;
  totalCount: number;
};

/** Raw RTK Query state consumed by the list normalizer. */
export type EmailSenderListQueryState = {
  data?: EmailSenderListResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Router state the list page receives after a create / update. */
export type EmailSenderRouteState = {
  successMessage?: string;
} | null;

/** Paging and search state of the email sender list. */
export type EmailSenderListPaging = {
  queryParams: EmailSenderListParams;
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/** Navigation handlers of the email sender list. */
export type EmailSenderNavigation = {
  handleBack: () => void;
  handleCreate: () => void;
  handleEdit: (emailSender: EmailSenderData) => void;
};

/** Email sender list state and handlers owned by the module hook. */
export type MasterEmailSenderController = EmailSenderListPaging & EmailSenderNavigation;

/** Props of the email sender mobile card. */
export type EmailSenderMobileCardProps = {
  emailSender: EmailSenderData;
  canEdit: boolean;
  onEdit: (emailSender: EmailSenderData) => void;
};

/** Props of the email sender list view. */
export type MasterEmailSenderProps = EmailSenderListView & {
  currentPage: number;
  pageSize: number;
  canCreate: boolean;
  canEdit: boolean;
  successMessage?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onCreate: () => void;
  onEdit: (emailSender: EmailSenderData) => void;
};
