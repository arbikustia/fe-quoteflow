import * as React from "react";

import { MasterDataCard } from "@/components/MasterDataCard";

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
 * Render quotation details for mobile card.
 * @param {QuotationMobileCardProps} props - Quotation card props
 * @returns {React.ReactElement} Quotation details
 */
const _renderDetails = (props: QuotationMobileCardProps): React.ReactElement => {
  const { quotation } = props;

  return React.createElement(
    "span",
    { className: "grid gap-1 text-lg text-text-secondary" },
    React.createElement("span", { className: "truncate" }, quotation.customerName),
    React.createElement("span", { className: "truncate" }, quotation.name),
    React.createElement("span", { className: "truncate" }, `${quotation.startDate} - ${quotation.endDate}`),
  );
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
  const handleClick = (): void => {
    onClick(quotation);
  };

  return React.createElement(
    MasterDataCard,
    {
      title: quotation.quotationNumber,
      status: quotation.status === 0 ? "inactive" : "active",
      onClick: handleClick,
      isLargeText: true,
      children: _renderDetails(props),
    },
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
