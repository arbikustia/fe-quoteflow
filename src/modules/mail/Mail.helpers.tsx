import * as React from "react";

import type { MailMobileCardProps } from "./Mail.type";

/**
 * Format a display value without changing source data.
 * @param {string} value - Source display value
 * @returns {string} Display value
 */
export const formatMailDisplayValue = (value: string): string => value || "—";

/**
 * Render mobile card footer with sender, recipient and created date.
 * @param {MailMobileCardProps["mail"]} mail - Mail data
 * @returns {React.ReactElement} Card footer element
 */
const _renderMailCardFooter = (mail: MailMobileCardProps["mail"]): React.ReactElement => (
  <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
    <span className="min-w-0">
      <span className="block text-lg text-text-tertiary">From</span>
      <span className="mt-1 block break-all text-lg font-medium text-text-primary">{formatMailDisplayValue(mail.senderEmail)}</span>
    </span>
    <span className="min-w-0">
      <span className="block text-lg text-text-tertiary">To</span>
      <span className="mt-1 block break-all text-lg font-medium text-text-primary">{formatMailDisplayValue(mail.recipientEmail)}</span>
    </span>
    <span className="text-right">
      <span className="block text-lg text-text-tertiary">Created</span>
      <span className="mt-1 block text-lg font-medium text-text-primary">{formatMailDisplayValue(mail.createdAt)}</span>
    </span>
  </span>
);

/**
 * Render single mail card on mobile.
 * @param {MailMobileCardProps} props - Mail card props
 * @returns {React.ReactElement} Mail card
 */
export const MailMobileCard = (props: MailMobileCardProps): React.ReactElement => {
  const { mail } = props;

  return (
    <article className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{mail.subject}</span>
        <span className="rounded-full border border-current px-3 py-1 text-base font-semibold uppercase text-text-secondary">{mail.status}</span>
      </div>
      {_renderMailCardFooter(mail)}
    </article>
  );
};

/**
 * Calculate mail table row number.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} Display row number
 */
export const getMailRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number => (currentPage - 1) * pageSize + rowIndex + 1;
