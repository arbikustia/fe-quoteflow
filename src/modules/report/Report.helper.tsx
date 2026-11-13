import type { ReactElement } from "react";

import { formatCurrency } from "@/modules/quotation/detail/QuotationDetail.util";
import { formatIndonesianDateTime } from "@/utils/date.helpers";

import type { OrderMobileCardProps, ReportOrderData } from "./Report.type";
import { getOrderCustomerLabel, getOrderEventTitle, getOrderStatusClass, getOrderStatusLabel } from "./Report.util";

/**
 * Render mobile order identity details.
 * @param {ReportOrderData} order - Report order row
 * @returns {ReactElement} - Identity details
 */
const _renderMobileIdentity = (order: ReportOrderData): ReactElement => (
  <span className="mt-4 grid min-w-0 grid-cols-3 gap-x-3 gap-y-2">
    <span className="text-lg text-text-tertiary">Event</span>
    <span className="col-span-2 break-words text-lg font-semibold text-text-primary">{getOrderEventTitle(order)}</span>
    <span className="text-lg text-text-tertiary">Customer</span>
    <span className="col-span-2 break-words text-lg text-text-secondary">{getOrderCustomerLabel(order)}</span>
  </span>
);

/**
 * Render mobile order period and total.
 * @param {ReportOrderData} order - Report order row
 * @returns {ReactElement} - Period and total details
 */
const _renderMobileSummary = (order: ReportOrderData): ReactElement => (
  <span className="mt-4 block border-t border-border-default pt-4">
    <span className="block text-lg text-text-tertiary">Event period</span>
    <span className="mt-1 block break-words text-lg font-medium leading-relaxed text-text-primary">
      {`${formatIndonesianDateTime(order.startDate)} – ${formatIndonesianDateTime(order.endDate)}`}
    </span>
    <span className="mt-4 flex items-end justify-between gap-4 border-t border-border-default pt-4">
      <span className="text-lg text-text-tertiary">Total</span>
      <span className="text-right text-xl font-semibold tabular-nums text-text-primary">{formatCurrency(order.grandTotal)}</span>
    </span>
  </span>
);

/**
 * Render single order card on mobile following quotation list card pattern.
 * @param {OrderMobileCardProps} props - Order card props
 * @returns {ReactElement} - Order card
 */
export const OrderMobileCard = (props: OrderMobileCardProps): ReactElement => {
  const { order, onEditStatus } = props;

  /**
   * Handle order card click.
   * @returns {void} - Nothing
   */
  const handleClick = (): void => onEditStatus(order);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-all text-lg font-medium text-text-secondary">{order.orderNo}</span>
        <span className={`rounded-full px-3.5 py-1 text-lg font-semibold uppercase ${getOrderStatusClass(order)}`}>{getOrderStatusLabel(order)}</span>
      </span>
      {_renderMobileIdentity(order)}
      {_renderMobileSummary(order)}
    </button>
  );
};
