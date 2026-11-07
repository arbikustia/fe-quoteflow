import * as React from "react";

import type { QuoteData } from "@/modules/order/Order.type";
import { formatIndonesianDateTime } from "@/utils/date.helpers";

import { formatCurrency, getQuotationStatusLabel, getStatusBadgeClass } from "./detail/QuotationDetail.helpers";
import type { ApiQuotation, QuotationData, QuotationMobileCardProps } from "./Quotation.type";

/**
 * Map quotation list row to quote data.
 * @param {QuotationData} quotation - Quotation data row
 * @param {Map<string, string>} itemCategories - Item category names by item ID
 * @returns {QuoteData} Quote data
 */
const _fromQuotationData = (quotation: QuotationData, itemCategories: Map<string, string>): QuoteData => ({
  id: quotation.quotationNumber || quotation.id,
  name: quotation.name || quotation.customerName || "Event",
  customerName: quotation.customerName,
  startDate: quotation.startDate,
  endDate: quotation.endDate,
  location: quotation.location || "-",
  category: "",
  selectedItems: quotation.items?.map((item) => item.item_name) ?? [],
  pdfItems: quotation.items?.map((item) => ({
    name: item.item_name,
    category: itemCategories.get(item.item_id) ?? "Uncategorized",
    qty: item.qty,
    price: item.price,
    remark: item.remark,
  })),
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
 * @param {Map<string, string>} itemCategories - Item category names by item ID
 * @returns {QuoteData} Quote data
 */
const _fromApiQuotation = (quotation: ApiQuotation, itemCategories: Map<string, string>): QuoteData => {
  const tx = quotation.transaction;
  const transactionItems = tx?.rental_transaction_items ?? [];
  const regularItems = transactionItems.filter(
    (item) => Boolean(item.item_id && item.item_name),
  );
  const items = regularItems.map((item) => item.item_name ?? "");

  return {
    id: quotation.quotation_no || quotation.id,
    name: tx?.event_name || tx?.customer_name || "Event",
    customerName: tx?.customer_name,
    startDate: tx?.start_at || quotation.quotation_date,
    endDate: tx?.end_at || quotation.quotation_date,
    location: tx?.address || "-",
    category: tx?.service_type_name || "",
    selectedItems: items,
    pdfItems: regularItems.map((item) => ({
      name: item.item_name ?? "",
      category: item.category_name ?? itemCategories.get(item.item_id ?? "") ?? "Uncategorized",
      qty: item.qty,
      price: item.price,
      remark: item.remark ?? "",
    })),
    pdfProjects: (tx?.rental_transaction_project ?? []).map((project) => ({
      name: project.name,
      qty: project.qty,
      price: project.price,
      remark: project.remark,
      items: (project.items ?? []).map((item) => ({
        name: item.item_name,
        qty: item.qty,
        remark: transactionItems.find(
          (transactionItem) =>
            transactionItem.project_id === project.id &&
            transactionItem.item_id === item.item_id,
        )?.remark ?? "",
      })),
    })),
    qty: 1,
    pph: 0,
    discount: tx?.discount ?? 0,
    serviceFee: tx?.service_fee ?? 0,
    remark: quotation.notes || "",
    grandTotal: tx?.grand_total ?? 0,
    status: quotation.status,
    customerPhone: tx?.customer_phone || "-",
  };
};

/**
 * Convert quotation to quote data for PDF generator.
 * @param {QuotationData | ApiQuotation} quotation - Quotation data or API quotation
 * @param {Map<string, string>} [itemCategories] - Item category names by item ID
 * @returns {QuoteData} Quote data
 */
export const quotationToQuoteData = (quotation: QuotationData | ApiQuotation, itemCategories = new Map<string, string>()): QuoteData => {
  if ("quotationNumber" in quotation) {
    return _fromQuotationData(quotation, itemCategories);
  }

  return _fromApiQuotation(quotation, itemCategories);
};

/**
 * Render mobile quotation identity details.
 * @param {QuotationData} quotation - Quotation row
 * @returns {React.ReactElement} Identity details
 */
const _renderMobileIdentity = (quotation: QuotationData): React.ReactElement => React.createElement(
  "span",
  { className: "mt-4 grid min-w-0 grid-cols-3 gap-x-3 gap-y-2" },
  React.createElement("span", { className: "text-lg text-text-tertiary" }, "Event"),
  React.createElement("span", { className: "col-span-2 break-words text-lg font-semibold text-text-primary" }, quotation.name),
  React.createElement("span", { className: "text-lg text-text-tertiary" }, "Customer"),
  React.createElement("span", { className: "col-span-2 break-words text-lg text-text-secondary" }, quotation.customerName),
);

/**
 * Render mobile quotation period and total.
 * @param {QuotationData} quotation - Quotation row
 * @returns {React.ReactElement} Period and total details
 */
const _renderMobileSummary = (quotation: QuotationData): React.ReactElement => React.createElement(
  "span",
  { className: "mt-4 block border-t border-border-default pt-4" },
  React.createElement("span", { className: "block text-lg text-text-tertiary" }, "Event period"),
  React.createElement("span", { className: "mt-1 block break-words text-lg font-medium leading-relaxed text-text-primary" }, `${formatIndonesianDateTime(quotation.startDate)} – ${formatIndonesianDateTime(quotation.endDate)}`),
  React.createElement(
    "span",
    { className: "mt-4 flex items-end justify-between gap-4 border-t border-border-default pt-4" },
    React.createElement("span", { className: "text-lg text-text-tertiary" }, "Total"),
    React.createElement("span", { className: "text-right text-xl font-semibold tabular-nums text-text-primary" }, formatCurrency(quotation.grandTotal)),
  ),
);

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
        className: `rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${getStatusBadgeClass(quotation.status)}`,
      }, getQuotationStatusLabel(quotation.status)),
    ),
    _renderMobileIdentity(quotation),
    _renderMobileSummary(quotation),
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
