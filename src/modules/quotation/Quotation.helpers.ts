import * as React from "react";

import { MasterDataCard } from "@/components/MasterDataCard";

import type { QuotationMobileCardProps } from "./Quotation.type";

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
      status: quotation.status === 1 ? "active" : "inactive",
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
