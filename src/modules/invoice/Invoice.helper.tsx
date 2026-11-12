import * as React from "react";

import { formatIndonesianDateTime } from "@/utils/date.helpers";

import type { InvoiceData, InvoiceMobileCardProps } from "./Invoice.type";
import { getPaymentStatusBadgeClass } from "./Invoice.util";

import { formatCurrency, getInvoiceStatusLabel, getStatusBadgeClass } from "@/modules/quotation/detail/QuotationDetail.util";

/**
 * Render mobile invoice identity details.
 * @param {InvoiceData} invoice - Invoice row
 * @returns {React.ReactElement} - Identity details
 */
const _renderMobileIdentity = (invoice: InvoiceData): React.ReactElement => (
  <span className="mt-4 grid min-w-0 grid-cols-3 gap-x-3 gap-y-2">
    <span className="text-lg text-text-tertiary">Event</span>
    <span className="col-span-2 break-words text-lg font-semibold text-text-primary">{invoice.name}</span>
    <span className="text-lg text-text-tertiary">Customer</span>
    <span className="col-span-2 break-words text-lg text-text-secondary">{invoice.customerName}</span>
  </span>
);

/**
 * Render mobile invoice period, total and payment status.
 * @param {InvoiceData} invoice - Invoice row
 * @returns {React.ReactElement} - Period and total details
 */
const _renderMobileSummary = (invoice: InvoiceData): React.ReactElement => (
  <span className="mt-4 block border-t border-border-default pt-4">
    <span className="block text-lg text-text-tertiary">Event period</span>
    <span className="mt-1 block break-words text-lg font-medium leading-relaxed text-text-primary">
      {`${formatIndonesianDateTime(invoice.startDate)} – ${formatIndonesianDateTime(invoice.endDate)}`}
    </span>
    <span className="mt-4 flex items-end justify-between gap-4 border-t border-border-default pt-4">
      <span className="text-lg text-text-tertiary">Total</span>
      <span className="text-right text-xl font-semibold tabular-nums text-text-primary">{formatCurrency(invoice.grandTotal)}</span>
    </span>
    <span className="mt-4 flex items-center justify-between gap-4 border-t border-border-default pt-4">
      <span className="text-lg text-text-tertiary">Payment status</span>
      <span className={`whitespace-nowrap rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${getPaymentStatusBadgeClass(invoice.paymentStatus)}`}>
        {invoice.paymentStatus}
      </span>
    </span>
  </span>
);

/**
 * Render invoice card on mobile.
 * @param {InvoiceMobileCardProps} props - Invoice and click callback
 * @returns {React.ReactElement} - Invoice card
 */
export const InvoiceMobileCard = (props: InvoiceMobileCardProps): React.ReactElement => {
  const { invoice, onClick } = props;

  /**
   * Notify the click callback with this card's invoice.
   * @returns {void} - Nothing
   */
  const handleClick = (): void => onClick(invoice);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-all text-lg font-medium text-text-secondary">{invoice.invoiceNumber}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${getStatusBadgeClass(invoice.status)}`}>
          {getInvoiceStatusLabel(invoice.status)}
        </span>
      </span>
      {_renderMobileIdentity(invoice)}
      {_renderMobileSummary(invoice)}
    </button>
  );
};
