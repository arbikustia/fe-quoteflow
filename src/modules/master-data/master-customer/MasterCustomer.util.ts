import { z } from "zod";

import type { CustomerListQueryState, CustomerListStatus, CustomerListView } from "./MasterCustomer.type";
import { CustomerListItemSchema } from "./MasterCustomer.type";

const CustomerListSchema = z.array(CustomerListItemSchema);

/**
 * Build an empty list view for a state without rows.
 * @param {CustomerListStatus} listStatus - List state to render
 * @returns {CustomerListView} - List view without rows
 */
const _createEmptyListView = (listStatus: CustomerListStatus): CustomerListView => ({
  listStatus,
  customers: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Normalize the paged customer query into list view data (single upstream fallback).
 * @param {CustomerListQueryState} queryState - RTK Query data and flags
 * @returns {CustomerListView} - Normalized list view data
 */
export const normalizeCustomerList = (queryState: CustomerListQueryState): CustomerListView => {
  const { data, isLoading, isError } = queryState;

  if (isLoading) {
    return _createEmptyListView("loading");
  }

  if (isError) {
    return _createEmptyListView("error");
  }

  const parsedCustomers = CustomerListSchema.safeParse(data?.data);

  if (!data || !parsedCustomers.success) {
    return _createEmptyListView("missing");
  }

  return {
    listStatus: parsedCustomers.data.length === 0 ? "empty" : "ready",
    customers: parsedCustomers.data,
    totalPages: data.total_pages,
    totalCount: data.total_count,
  };
};

/**
 * Calculate the display row number of a customer table row.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} - One-based row number across pages
 */
export const getCustomerRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number => {
  return (currentPage - 1) * pageSize + rowIndex + 1;
};
