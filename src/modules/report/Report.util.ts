import { REPORT_CONFIG } from "./Report.config";
import type { RentalOrderUpdateRequest,ReportOrderData } from "./Report.type";

const SUCCESS_STATUS_CLASS = "bg-success-subtle text-success-strong";
const DANGER_STATUS_CLASS = "bg-danger-subtle text-danger-strong";

/**
 * Calculate report table row number.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} - Display row number
 */
export const getOrderRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number => (currentPage - 1) * pageSize + rowIndex + 1;

/**
 * Sort report orders from newest to oldest.
 * @param {ReportOrderData[]} orders - Report order rows
 * @returns {ReportOrderData[]} - Sorted report order rows
 */
export const sortReportOrders = (orders: ReportOrderData[]): ReportOrderData[] => [...orders].sort((firstOrder, secondOrder) => {
  const dateDifference = Date.parse(secondOrder.rawOrderDate) - Date.parse(firstOrder.rawOrderDate);

  return dateDifference || secondOrder.orderNo.localeCompare(firstOrder.orderNo);
});

/**
 * Check whether an order is already marked as done.
 * @param {ReportOrderData} order - Report order row
 * @returns {boolean} - True when the order is done
 */
export const isOrderDone = (order: ReportOrderData): boolean => order.status === REPORT_CONFIG.STATUS_DONE;

/**
 * Get the status label shown to the user.
 * @param {ReportOrderData} order - Report order row
 * @returns {string} - Status label
 */
export const getOrderStatusLabel = (order: ReportOrderData): string => (isOrderDone(order) ? "Done" : order.statusLabel);

/**
 * Get the status badge color classes.
 * @param {ReportOrderData} order - Report order row
 * @returns {string} - Tailwind classes
 */
export const getOrderStatusClass = (order: ReportOrderData): string => (
  isOrderDone(order) || order.status === REPORT_CONFIG.STATUS_ACTIVE ? SUCCESS_STATUS_CLASS : DANGER_STATUS_CLASS
);

/**
 * Get the event title shown on the mobile card.
 * @param {ReportOrderData} order - Report order row
 * @returns {string} - Event name, or the order number when the event name is empty
 */
export const getOrderEventTitle = (order: ReportOrderData): string => order.eventName || order.orderNo;

/**
 * Get the customer label shown on the mobile card.
 * @param {ReportOrderData} order - Report order row
 * @returns {string} - Customer name, or a placeholder when empty
 */
export const getOrderCustomerLabel = (order: ReportOrderData): string => order.customerName || "No customer name";

/**
 * Build the full rental-order update request with a new status.
 * @param {ReportOrderData} order - Report order row
 * @param {number} status - New order status
 * @returns {RentalOrderUpdateRequest} - Update request
 */
export const buildOrderUpdateRequest = (order: ReportOrderData, status: number): RentalOrderUpdateRequest => ({
  id: order.id,
  transaction_id: order.transactionId,
  invoice_id: order.invoiceId,
  quotation_id: order.quotationId,
  order_no: order.orderNo,
  order_date: order.rawOrderDate,
  notes: order.notes,
  status,
});

/**
 * Build the confirmation message for marking an order as done.
 * @param {string} orderNo - Order number
 * @returns {string} - Confirmation message
 */
export const buildConfirmMessage = (orderNo: string): string => `Are you sure you want to mark order ${orderNo} as done?`;
