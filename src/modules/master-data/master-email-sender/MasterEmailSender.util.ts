import { z } from "zod";

import type { EmailSenderListQueryState, EmailSenderListStatus, EmailSenderListView } from "./MasterEmailSender.type";
import { EmailSenderListItemSchema } from "./MasterEmailSender.type";

const EmailSenderListSchema = z.array(EmailSenderListItemSchema);

/**
 * Build an empty list view for a state without rows.
 * @param {EmailSenderListStatus} listStatus - List state to render
 * @returns {EmailSenderListView} - List view without rows
 */
const _createEmptyListView = (listStatus: EmailSenderListStatus): EmailSenderListView => ({
  listStatus,
  emailSenders: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Normalize the paged email sender query into list view data (single upstream fallback).
 * @param {EmailSenderListQueryState} queryState - RTK Query data and flags
 * @returns {EmailSenderListView} - Normalized list view data
 */
export const normalizeEmailSenderList = (queryState: EmailSenderListQueryState): EmailSenderListView => {
  const { data, isLoading, isError } = queryState;

  if (isLoading) {
    return _createEmptyListView("loading");
  }

  if (isError) {
    return _createEmptyListView("error");
  }

  const parsedEmailSenders = EmailSenderListSchema.safeParse(data?.data);

  if (!data || !parsedEmailSenders.success) {
    return _createEmptyListView("missing");
  }

  return {
    listStatus: parsedEmailSenders.data.length === 0 ? "empty" : "ready",
    emailSenders: parsedEmailSenders.data,
    totalPages: data.total_pages,
    totalCount: data.total_count,
  };
};

/**
 * Calculate the display row number of an email sender table row.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} - One-based row number across pages
 */
export const getEmailSenderRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number => {
  return (currentPage - 1) * pageSize + rowIndex + 1;
};
