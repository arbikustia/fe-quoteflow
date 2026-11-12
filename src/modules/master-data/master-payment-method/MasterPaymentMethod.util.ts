import { z } from "zod";

import type { PaymentMethodListQueryState, PaymentMethodListStatus, PaymentMethodListView } from "./MasterPaymentMethod.type";
import { PaymentMethodListItemSchema } from "./MasterPaymentMethod.type";

const PaymentMethodListSchema = z.array(PaymentMethodListItemSchema);

/**
 * Build an empty list view for a state without rows.
 * @param {PaymentMethodListStatus} listStatus - List state to render
 * @returns {PaymentMethodListView} - List view without rows
 */
const _createEmptyListView = (listStatus: PaymentMethodListStatus): PaymentMethodListView => ({
  listStatus,
  paymentMethods: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Normalize the paged payment method query into list view data (single upstream fallback).
 * @param {PaymentMethodListQueryState} queryState - RTK Query data and flags
 * @returns {PaymentMethodListView} - Normalized list view data
 */
export const normalizePaymentMethodList = (queryState: PaymentMethodListQueryState): PaymentMethodListView => {
  const { data, isLoading, isError } = queryState;

  if (isLoading) {
    return _createEmptyListView("loading");
  }

  if (isError) {
    return _createEmptyListView("error");
  }

  const parsedPaymentMethods = PaymentMethodListSchema.safeParse(data?.data);

  if (!data || !parsedPaymentMethods.success) {
    return _createEmptyListView("missing");
  }

  return {
    listStatus: parsedPaymentMethods.data.length === 0 ? "empty" : "ready",
    paymentMethods: parsedPaymentMethods.data,
    totalPages: data.total_pages,
    totalCount: data.total_count,
  };
};

/**
 * Calculate the display row number of a payment method table row.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} - One-based row number across pages
 */
export const getPaymentMethodRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number => {
  return (currentPage - 1) * pageSize + rowIndex + 1;
};
