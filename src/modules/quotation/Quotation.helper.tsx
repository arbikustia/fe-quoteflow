import * as React from "react";

import { formatIndonesianDateTime } from "@/utils/date.helpers";

import { formatCurrency, getQuotationStatusLabel, getStatusBadgeClass } from "./detail/QuotationDetail.util";
import type { QuotationData, QuotationMobileCardProps } from "./Quotation.type";

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
