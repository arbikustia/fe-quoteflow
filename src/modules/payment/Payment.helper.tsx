import type * as React from "react";

import type { PaymentMobileCardProps } from "./Payment.type";

import { formatCurrency, formatDate } from "@/modules/quotation/detail/QuotationDetail.util";

/**
 * Render payment card on mobile.
 * @param {PaymentMobileCardProps} props - Payment card props
 * @returns {React.ReactElement} Payment card
 */
export const PaymentMobileCard = (props: PaymentMobileCardProps): React.ReactElement => {
  const { payment, onClick } = props;

  /**
   * Notify the click callback with this card's payment.
   * @returns {void} - Nothing
   */
  const handleClick = (): void => onClick(payment);

  return (
  <button
    type="button"
    onClick={handleClick}
    className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
  >
    <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
      <span className="min-w-0 break-all text-lg font-medium text-text-primary">{payment.invoiceNo}</span>
      <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${(payment.remainingAmount ?? 0) > 0 ? "bg-warning-subtle text-warning-strong" : "bg-success-subtle text-success-strong"}`}>
        {payment.statusLabel || ((payment.remainingAmount ?? 0) > 0 ? "Unpaid" : "Paid")}
      </span>
    </span>
    <span className="mt-4 block break-all text-xl font-semibold text-text-primary">{formatCurrency(payment.amount)}</span>
    <span className="mt-1.5 block break-words text-lg text-text-secondary">{payment.customerName}</span>
    <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <span className="min-w-0 text-lg text-text-secondary">
        <span className="block text-lg text-text-tertiary">Paid at</span>
        <span className="mt-1 block text-lg font-medium text-text-primary">{formatDate(payment.paidAt)}</span>
      </span>
      <span className="text-right tabular-nums">
        <span className="block text-lg text-text-tertiary">Amount</span>
        <span className="mt-1 block text-xl font-semibold text-text-primary">{formatCurrency(payment.amount)}</span>
      </span>
    </span>
  </button>
);
};
