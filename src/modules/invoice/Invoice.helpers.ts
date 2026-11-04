import * as React from "react";

import type { ApiInvoice, InvoiceData, InvoiceMobileCardProps } from "./Invoice.type";

import type { QuoteData } from "@/modules/order/Order.type";
import { formatCurrency, formatDate, getInvoiceStatusLabel, getStatusBadgeClass } from "@/modules/quotation/detail/QuotationDetail.helpers";

/**
 * Map invoice list row to quote data.
 * @param {InvoiceData} invoice - Invoice data row
 * @returns {QuoteData} Quote data
 */
const _fromInvoiceData = (invoice: InvoiceData): QuoteData => ({
  id: invoice.invoiceNumber || invoice.id,
  name: invoice.name || invoice.customerName || "Event",
  startDate: invoice.startDate,
  endDate: invoice.endDate,
  location: invoice.location || "-",
  category: "",
  selectedItems: [],
  qty: 1,
  pph: 0,
  discount: 0,
  remark: invoice.notes || "",
  grandTotal: invoice.grandTotal,
  status: invoice.status,
  customerPhone: invoice.customerPhone || "-",
});

/**
 * Map api invoice to quote data.
 * @param {ApiInvoice} invoice - Api invoice
 * @returns {QuoteData} Quote data
 */
const _fromApiInvoice = (invoice: ApiInvoice): QuoteData => {
  const tx = invoice.quotation?.transaction;
  const items = tx?.rental_transaction_items?.map((item) => item.item_name) ?? [];

  return {
    id: invoice.invoice_no || invoice.id,
    name: tx?.event_name || tx?.customer_name || "Event",
    startDate: tx?.start_at || invoice.invoice_date,
    endDate: tx?.end_at || invoice.invoice_date,
    location: tx?.address || "-",
    category: tx?.service_type_name || "",
    selectedItems: items,
    qty: 1,
    pph: 0,
    discount: tx?.discount ?? 0,
    remark: invoice.notes || "",
    grandTotal: tx?.grand_total ?? 0,
    status: invoice.status,
    customerPhone: tx?.customer_phone || "-",
  };
};

/**
 * Convert invoice to quote data for PDF generator.
 * @param {InvoiceData | ApiInvoice} invoice - Invoice data or API invoice
 * @returns {QuoteData} Quote data
 */
export const invoiceToQuoteData = (invoice: InvoiceData | ApiInvoice): QuoteData => {
  if ("invoiceNumber" in invoice) {
    return _fromInvoiceData(invoice);
  }

  return _fromApiInvoice(invoice);
};

/**
 * Render invoice card on mobile.
 * @param {InvoiceMobileCardProps} props - Invoice card props
 * @returns {React.ReactElement} Invoice card
 */
export const InvoiceMobileCard = (props: InvoiceMobileCardProps): React.ReactElement => {
  const { invoice, onClick } = props;

  /**
   * Handle invoice card click.
   * @returns {void} No return value
   */
  const handleClick = (): void => onClick(invoice);

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
      React.createElement("span", { className: "min-w-0 break-all text-lg font-medium text-text-secondary" }, invoice.invoiceNumber),
      React.createElement("span", {
        className: `rounded-full px-3.5 py-1 text-lg font-semibold ${getStatusBadgeClass(invoice.status)}`,
      }, getInvoiceStatusLabel(invoice.status)),
    ),
    React.createElement("span", { className: "mt-4 block break-words text-xl font-semibold text-text-primary" }, invoice.name),
    React.createElement("span", { className: "mt-1.5 block break-words text-lg text-text-secondary" }, invoice.customerName),
    React.createElement(
      "span",
      { className: "mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4" },
      React.createElement("span", { className: "min-w-0 text-lg text-text-secondary" },
        React.createElement("span", { className: "block text-lg text-text-tertiary" }, "Event period"),
        React.createElement("span", { className: "mt-1 block break-words text-lg font-medium text-text-primary" }, `${formatDate(invoice.startDate)} – ${formatDate(invoice.endDate)}`),
      ),
      React.createElement("span", { className: "text-right tabular-nums" },
        React.createElement("span", { className: "block text-lg text-text-tertiary" }, "Total"),
        React.createElement("span", { className: "mt-1 block text-xl font-semibold text-text-primary" }, formatCurrency(invoice.grandTotal)),
      ),
    ),
  );
};

/**
 * Calculate invoice table row number.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} index - Zero-based row index
 * @returns {number} Display row number
 */
export const getInvoiceRowNumber = (currentPage: number, pageSize: number, index: number): number => (currentPage - 1) * pageSize + index + 1;
