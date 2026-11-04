import * as React from "react";

import type { QuoteData } from "@/modules/order/Order.type";
import { formatCurrency } from "@/modules/quotation/detail/QuotationDetail.helpers";
import { formatIndonesianDateTime } from "@/utils/date.helpers";

import type { OrderMobileCardProps, ReportOrderData } from "./Report.type";

/**
 * Render single order card on mobile following quotation list card pattern.
 * @param {OrderMobileCardProps} props - Order card props
 * @returns {React.ReactElement} Order card
 */
export const OrderMobileCard = (props: OrderMobileCardProps): React.ReactElement => {
  const { order, onEditStatus } = props;

  /**
   * Handle order card click.
   * @returns {void} No return value
   */
  const handleClick = (): void => onEditStatus(order);

  const statusClass = order.status === 2 || order.status === 1 ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong";
  const displayStatus = order.status === 2 ? "Done" : order.statusLabel;

  return React.createElement(
    "button",
    {
      type: "button",
      onClick: handleClick,
      className: "group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary",
    },
    React.createElement(
      "span",
      { className: "flex min-w-0 flex-wrap items-center justify-between gap-3" },
      React.createElement("span", { className: "min-w-0 break-all text-lg font-medium text-text-secondary" }, order.orderNo),
      React.createElement("span", {
        className: `rounded-full px-3.5 py-1 text-lg font-semibold uppercase ${statusClass}`,
      }, displayStatus),
    ),
    React.createElement("span", { className: "mt-4 block break-words text-xl font-semibold text-text-primary" }, order.eventName || order.orderNo),
    React.createElement("span", { className: "mt-1.5 block break-words text-lg text-text-secondary" }, order.customerName || "No customer name"),
    React.createElement(
      "span",
      { className: "mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4" },
      React.createElement(
        "span",
        { className: "min-w-0 text-lg text-text-secondary" },
        React.createElement("span", { className: "block text-lg text-text-tertiary" }, "Event period"),
        React.createElement("span", { className: "mt-1 block break-words text-lg font-medium text-text-primary" }, `${formatIndonesianDateTime(order.startDate)} – ${formatIndonesianDateTime(order.endDate)}`),
      ),
      React.createElement(
        "span",
        { className: "text-right tabular-nums" },
        React.createElement("span", { className: "block text-lg text-text-tertiary" }, "Total"),
        React.createElement("span", { className: "mt-1 block text-xl font-semibold text-text-primary" }, formatCurrency(order.grandTotal)),
      ),
    ),
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
