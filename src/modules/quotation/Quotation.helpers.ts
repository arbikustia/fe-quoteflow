import * as React from "react";

import { formatCurrency, formatDate, getQuotationStatusLabel, getStatusBadgeClass } from "./detail/QuotationDetail.helpers";
import type { ApiQuotation, QuotationData, QuotationMobileCardProps } from "./Quotation.type";

import type { QuoteData } from "@/modules/order/Order.type";

/**
 * Map quotation list row to quote data.
 * @param {QuotationData} quotation - Quotation data row
 * @returns {QuoteData} Quote data
 */
const _fromQuotationData = (quotation: QuotationData): QuoteData => ({
  id: quotation.quotationNumber || quotation.id,
  name: quotation.name || quotation.customerName || "Event",
  startDate: quotation.startDate,
  endDate: quotation.endDate,
  location: quotation.location || "-",
  category: "",
  selectedItems: [],
  qty: 1,
  pph: 0,
  discount: 0,
  remark: "",
  grandTotal: quotation.grandTotal,
  status: quotation.status,
  customerPhone: quotation.customerPhone || "-",
});

/**
 * Map api quotation to quote data.
 * @param {ApiQuotation} quotation - Api quotation
 * @returns {QuoteData} Quote data
 */
const _fromApiQuotation = (quotation: ApiQuotation): QuoteData => {
  const tx = quotation.transaction;
  const items = tx?.rental_transaction_items?.map((item) => item.item_name) ?? [];

  return {
    id: quotation.quotation_no || quotation.id,
    name: tx?.event_name || tx?.customer_name || "Event",
    startDate: tx?.start_at || quotation.quotation_date,
    endDate: tx?.end_at || quotation.quotation_date,
    location: tx?.address || "-",
    category: tx?.service_type_name || "",
    selectedItems: items,
    qty: 1,
    pph: 0,
    discount: tx?.discount ?? 0,
    remark: quotation.notes || "",
    grandTotal: tx?.grand_total ?? 0,
    status: quotation.status,
    customerPhone: tx?.customer_phone || "-",
  };
};

/**
 * Convert quotation to quote data for PDF generator.
 * @param {QuotationData | ApiQuotation} quotation - Quotation data or API quotation
 * @returns {QuoteData} Quote data
 */
export const quotationToQuoteData = (quotation: QuotationData | ApiQuotation): QuoteData => {
  if ("quotationNumber" in quotation) {
    return _fromQuotationData(quotation);
  }

  return _fromApiQuotation(quotation);
};

/**
 * Render quotation card on mobile.
 * @param {QuotationMobileCardProps} props - Quotation card props
 * @returns {React.ReactElement} Quotation card
 */
export const QuotationMobileCard = (props: QuotationMobileCardProps): React.ReactElement => {
  const { quotation, onClick } = props;

  /**
   * Handle quotation card click.
   * @returns {void} No return value
   */
  const handleClick = (): void => onClick(quotation);

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
      React.createElement("span", { className: "min-w-0 break-all text-lg font-medium text-text-secondary" }, quotation.quotationNumber),
      React.createElement("span", {
        className: `rounded-full px-3.5 py-1 text-lg font-semibold ${getStatusBadgeClass(quotation.status)}`,
      }, getQuotationStatusLabel(quotation.status)),
    ),
    React.createElement("span", { className: "mt-4 block break-words text-xl font-semibold text-text-primary" }, quotation.name),
    React.createElement("span", { className: "mt-1.5 block break-words text-lg text-text-secondary" }, quotation.customerName),
    React.createElement(
      "span",
      { className: "mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4" },
      React.createElement("span", { className: "min-w-0 text-lg text-text-secondary" },
        React.createElement("span", { className: "block text-lg text-text-tertiary" }, "Event period"),
        React.createElement("span", { className: "mt-1 block break-words text-lg font-medium text-text-primary" }, `${formatDate(quotation.startDate)} – ${formatDate(quotation.endDate)}`),
      ),
      React.createElement("span", { className: "text-right tabular-nums" },
        React.createElement("span", { className: "block text-lg text-text-tertiary" }, "Total"),
        React.createElement("span", { className: "mt-1 block text-xl font-semibold text-text-primary" }, formatCurrency(quotation.grandTotal)),
      ),
    ),
  );
};

/**
 * Calculate quotation table row number.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} index - Zero-based row index
 * @returns {number} Display row number
 */
export const getQuotationRowNumber = (currentPage: number, pageSize: number, index: number): number => (currentPage - 1) * pageSize + index + 1;
