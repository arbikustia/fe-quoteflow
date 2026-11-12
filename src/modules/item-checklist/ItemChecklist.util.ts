import { CHECKLIST_API_STATUS } from "./ItemChecklist.config";
import type { ApiChecklist, ChecklistRow } from "./ItemChecklist.type";

import type { ApiRentalOrder } from "@/modules/report/Report.type";

/**
 * Resolve the customer name shown for a rental order.
 * @param {ApiRentalOrder | undefined} order - Rental order data
 * @returns {string} - Customer name, or empty string when unavailable
 */
export const getOrderCustomerName = (order: ApiRentalOrder | undefined): string => {
  if (!order) return "";

  const transaction = order.invoice?.quotation?.transaction;

  return transaction?.customer_name ?? transaction?.customer?.name ?? "";
};

/**
 * Map API checklist to row data.
 * @param {ApiChecklist} checklist - API checklist response
 * @param {string} customerName - Associated customer name
 * @returns {ChecklistRow} Mapped checklist row
 */
export const mapChecklist = (checklist: ApiChecklist, customerName: string): ChecklistRow => ({
  id: checklist.id,
  checklistNo: checklist.checklist_no,
  customerName,
  checklistDate: checklist.checklist_date,
  itemCount: checklist.items.length,
  status: CHECKLIST_API_STATUS[checklist.status ?? 0] ?? "unavailable",
  orderId: checklist.order_id,
});

/**
 * Get the sequential row number across pages.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} index - Zero-based row index
 * @returns {number} Row number
 */
export const getChecklistRowNumber = (currentPage: number, pageSize: number, index: number): number => (currentPage - 1) * pageSize + index + 1;

/**
 * Get the table row key of a checklist.
 * @param {ChecklistRow} row - Checklist row
 * @returns {string} Row key
 */
export const getChecklistRowKey = (row: ChecklistRow): string => row.id;
