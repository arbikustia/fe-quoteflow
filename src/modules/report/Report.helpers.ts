import * as React from "react";

import { formatCurrency } from "@/modules/quotation/detail/QuotationDetail.helpers";
import { formatIndonesianDateTime } from "@/utils/date.helpers";

import type { OrderMobileCardProps, ReportOrderData } from "./Report.type";

/**
 * Render mobile order identity details.
 * @param {ReportOrderData} order - Report order row
 * @returns {React.ReactElement} Identity details
 */
const _renderMobileIdentity = (order: ReportOrderData): React.ReactElement => React.createElement(
  "span",
  { className: "mt-4 grid min-w-0 grid-cols-3 gap-x-3 gap-y-2" },
  React.createElement("span", { className: "text-lg text-text-tertiary" }, "Event"),
  React.createElement("span", { className: "col-span-2 break-words text-lg font-semibold text-text-primary" }, order.eventName || order.orderNo),
  React.createElement("span", { className: "text-lg text-text-tertiary" }, "Customer"),
  React.createElement("span", { className: "col-span-2 break-words text-lg text-text-secondary" }, order.customerName || "No customer name"),
);

/**
 * Render mobile order period and total.
 * @param {ReportOrderData} order - Report order row
 * @returns {React.ReactElement} Period and total details
 */
const _renderMobileSummary = (order: ReportOrderData): React.ReactElement => React.createElement(
  "span",
  { className: "mt-4 block border-t border-border-default pt-4" },
  React.createElement("span", { className: "block text-lg text-text-tertiary" }, "Event period"),
  React.createElement("span", { className: "mt-1 block break-words text-lg font-medium leading-relaxed text-text-primary" }, `${formatIndonesianDateTime(order.startDate)} – ${formatIndonesianDateTime(order.endDate)}`),
  React.createElement(
    "span",
    { className: "mt-4 flex items-end justify-between gap-4 border-t border-border-default pt-4" },
    React.createElement("span", { className: "text-lg text-text-tertiary" }, "Total"),
    React.createElement("span", { className: "text-right text-xl font-semibold tabular-nums text-text-primary" }, formatCurrency(order.grandTotal)),
  ),
);

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
    _renderMobileIdentity(order),
    _renderMobileSummary(order),
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
 * Sort report orders from newest to oldest.
 * @param {ReportOrderData[]} orders - Report order rows
 * @returns {ReportOrderData[]} Sorted report order rows
 */
export const sortReportOrders = (orders: ReportOrderData[]): ReportOrderData[] => [...orders].sort((firstOrder, secondOrder) => {
  const dateDifference = Date.parse(secondOrder.rawOrderDate) - Date.parse(firstOrder.rawOrderDate);

  return dateDifference || secondOrder.orderNo.localeCompare(firstOrder.orderNo);
});
