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
