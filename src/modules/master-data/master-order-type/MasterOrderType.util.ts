import { z } from "zod";

import type { OrderTypeListQueryState, OrderTypeListStatus, OrderTypeListView } from "./MasterOrderType.type";
import { OrderTypeListItemSchema } from "./MasterOrderType.type";

const OrderTypeListSchema = z.array(OrderTypeListItemSchema);

/**
 * Build an empty list view for a state without rows.
 * @param {OrderTypeListStatus} listStatus - List state to render
 * @returns {OrderTypeListView} - List view without rows
 */
const _createEmptyListView = (listStatus: OrderTypeListStatus): OrderTypeListView => ({
  listStatus,
  orderTypes: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Normalize the paged order type query into list view data (single upstream fallback).
 * @param {OrderTypeListQueryState} queryState - RTK Query data and flags
 * @returns {OrderTypeListView} - Normalized list view data
 */
export const normalizeOrderTypeList = (queryState: OrderTypeListQueryState): OrderTypeListView => {
  const { data, isLoading, isError } = queryState;

  if (isLoading) {
    return _createEmptyListView("loading");
  }

  if (isError) {
    return _createEmptyListView("error");
  }

  const parsedOrderTypes = OrderTypeListSchema.safeParse(data?.data);

  if (!data || !parsedOrderTypes.success) {
    return _createEmptyListView("missing");
  }

  return {
    listStatus: parsedOrderTypes.data.length === 0 ? "empty" : "ready",
    orderTypes: parsedOrderTypes.data,
    totalPages: data.total_pages,
    totalCount: data.total_count,
  };
};

/**
 * Calculate the display row number of an order type table row.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} - One-based row number across pages
 */
export const getOrderTypeRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number => {
  return (currentPage - 1) * pageSize + rowIndex + 1;
};
