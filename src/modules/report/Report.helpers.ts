import * as React from "react";

import { MasterDataCard } from "@/components/MasterDataCard";

import type { QuoteData } from "@/modules/order/Order.type";

import type { OrderMobileCardProps, ReportOrderData } from "./Report.type";

/**
 * Render order details on mobile card.
 * @param {ReportOrderData} order - Report order data
 * @returns {React.ReactElement} Details node
 */
const _renderDetails = (order: ReportOrderData): React.ReactElement => React.createElement(
  "span",
  { className: "grid gap-1 text-lg text-text-secondary" },
  React.createElement("span", { className: "truncate" }, order.customerName || "No customer name"),
  React.createElement("span", { className: "truncate" }, order.eventName || "No event name"),
  React.createElement("span", { className: "truncate" }, order.startDate && order.endDate ? `${order.startDate} - ${order.endDate}` : order.address || "No details"),
);

/**
 * Render single order card on mobile.
 * @param {OrderMobileCardProps} props - Order card props
 * @returns {React.ReactElement} Order card
 */
export const OrderMobileCard = (props: OrderMobileCardProps): React.ReactElement => {
  const { order, onRowClick } = props;

  /**
   * Handle order card click.
   * @returns {void} No return value
   */
  const handleClick = (): void => {
    if (onRowClick) onRowClick(order);
  };

  return React.createElement(
    MasterDataCard,
    { title: order.orderNo, status: order.statusLabel, onClick: handleClick, isLargeText: true, children: _renderDetails(order) },
  );
};

/**
 * Calculate report table row number.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} Display row number
 */
export const getOrderRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number => (currentPage - 1) * pageSize + rowIndex + 1;

/**
 * Convert report order data to quote data for PDF generation.
 * @param {ReportOrderData} order - Report order data
 * @returns {QuoteData} Quote data
 */
export const toQuoteData = (order: ReportOrderData): QuoteData => ({
  id: order.id,
  name: order.eventName || order.orderNo,
  startDate: order.startDate,
  endDate: order.endDate,
  location: order.address,
  category: "",
  selectedItems: [],
  qty: 1,
  pph: order.grandTotal,
  discount: 0,
  remark: "",
  grandTotal: order.grandTotal,
  status: order.status,
  customerPhone: order.customerPhone,
});
