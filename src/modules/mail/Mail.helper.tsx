import type { ReactElement } from "react";

import type { MailMobileCardProps } from "./Mail.type";
import { formatMailDisplayValue } from "./Mail.util";

/**
 * Render mail mobile card footer with sender, recipient and created date.
 * @param {MailMobileCardProps["mail"]} mail - Mail data
 * @returns {ReactElement} Card footer element
 */
const _renderMailCardFooter = (mail: MailMobileCardProps["mail"]): ReactElement => (
  <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
    <span className="min-w-0">
      <span className="block text-lg text-text-tertiary">From</span>
      <span className="mt-1 block break-all text-lg font-medium text-text-primary">{formatMailDisplayValue(mail.senderEmail)}</span>
      <span className="mt-3 block text-lg text-text-tertiary">To</span>
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
 * @returns {ReactElement} Mail card
 */
export const MailMobileCard = (props: MailMobileCardProps): ReactElement => {
  const { mail } = props;

  return (
    <article
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
    >
      <span className="block min-w-0 break-words text-xl font-semibold text-text-primary">{mail.subject}</span>
      {_renderMailCardFooter(mail)}
    </article>
  );
};
