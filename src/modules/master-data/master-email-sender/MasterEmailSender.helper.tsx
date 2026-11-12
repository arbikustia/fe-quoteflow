import type * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "@/components/Table";

import { EMAIL_SENDER_FLAG_BADGE_CLASS, EMAIL_SENDER_FLAG_LABEL, EMAIL_SENDER_STATUS_BADGE_CLASS } from "./MasterEmailSender.config";
import type { EmailSenderData, EmailSenderFlag, EmailSenderMobileCardProps } from "./MasterEmailSender.type";
import { getEmailSenderRowNumber } from "./MasterEmailSender.util";

/**
 * Create an edit click handler that does not bubble up to the table row click.
 * @param {EmailSenderData} emailSender - Sender of the row
 * @param {(emailSender: EmailSenderData) => void} onEdit - Edit callback
 * @returns {(event: React.MouseEvent<HTMLButtonElement>) => void} - Edit button click handler
 */
export const _createEditClickHandler = (
  emailSender: EmailSenderData,
  onEdit: (emailSender: EmailSenderData) => void,
): ((event: React.MouseEvent<HTMLButtonElement>) => void) => {
  return (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onEdit(emailSender);
  };
};

/**
 * Render a yes / no badge.
 * @param {EmailSenderFlag} flag - Flag value
 * @returns {React.ReactElement} - Flag badge
 */
const _renderFlagBadge = (flag: EmailSenderFlag): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${EMAIL_SENDER_FLAG_BADGE_CLASS[flag]}`}>
    {flag}
  </span>
);

/**
 * Render the sender name cell.
 * @param {EmailSenderData} emailSender - Sender row
 * @returns {React.ReactElement} - Name cell
 */
const _renderNameCell = (emailSender: EmailSenderData): React.ReactElement => (
  <span className="text-lg font-medium text-text-primary">{emailSender.name}</span>
);

/**
 * Render the sender email cell.
 * @param {EmailSenderData} emailSender - Sender row
 * @returns {React.ReactElement} - Email cell
 */
const _renderEmailCell = (emailSender: EmailSenderData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{emailSender.email}</span>
);

/**
 * Render the SMTP host and port cell.
 * @param {EmailSenderData} emailSender - Sender row
 * @returns {React.ReactElement} - SMTP server cell
 */
const _renderSmtpServerCell = (emailSender: EmailSenderData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{emailSender.smtpServer}</span>
);

/**
 * Render the SSL flag cell.
 * @param {EmailSenderData} emailSender - Sender row
 * @returns {React.ReactElement} - SSL badge cell
 */
const _renderSslCell = (emailSender: EmailSenderData): React.ReactElement => _renderFlagBadge(emailSender.enableSsl);

/**
 * Render the default sender flag cell.
 * @param {EmailSenderData} emailSender - Sender row
 * @returns {React.ReactElement} - Default badge cell
 */
const _renderDefaultCell = (emailSender: EmailSenderData): React.ReactElement => _renderFlagBadge(emailSender.isDefault);

/**
 * Render the sender status cell.
 * @param {EmailSenderData} emailSender - Sender row
 * @returns {React.ReactElement} - Status badge cell
 */
const _renderStatusCell = (emailSender: EmailSenderData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${EMAIL_SENDER_STATUS_BADGE_CLASS[emailSender.status]}`}>
    {emailSender.status}
  </span>
);

/**
 * Render the created-at cell.
 * @param {EmailSenderData} emailSender - Sender row
 * @returns {React.ReactElement} - Created-at cell
 */
const _renderCreatedAtCell = (emailSender: EmailSenderData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{emailSender.createdAt}</span>
);

/**
 * Render the row action cell.
 * @param {EmailSenderData} emailSender - Sender row
 * @param {(emailSender: EmailSenderData) => void} onEdit - Edit callback
 * @returns {React.ReactElement} - Action cell
 */
const _renderActionCell = (emailSender: EmailSenderData, onEdit: (emailSender: EmailSenderData) => void): React.ReactElement => (
  <div className="flex items-center justify-center gap-1">
    <button
      type="button"
      onClick={_createEditClickHandler(emailSender, onEdit)}
      className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
      title="Edit email sender"
      aria-label={`Edit email sender ${emailSender.name}`}
    >
      <FiEdit2 className="h-5 w-5" />
    </button>
  </div>
);

/**
 * Build the email sender table columns; the action column is shown only with edit permission.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {boolean} canEdit - Whether the user may edit senders
 * @param {(emailSender: EmailSenderData) => void} onEdit - Edit callback
 * @returns {TableColumn<EmailSenderData>[]} - Email sender table columns
 */
export const getEmailSenderColumns = (
  currentPage: number,
  pageSize: number,
  canEdit: boolean,
  onEdit: (emailSender: EmailSenderData) => void,
): TableColumn<EmailSenderData>[] => {
  /**
   * Render the row number cell.
   * @param {EmailSenderData} _emailSender - Sender row
   * @param {number} rowIndex - Zero-based row index
   * @returns {React.ReactElement} - Row number cell
   */
  const renderNumberCell = (_emailSender: EmailSenderData, rowIndex: number): React.ReactElement => (
    <span className="text-lg text-text-secondary">{getEmailSenderRowNumber(currentPage, pageSize, rowIndex)}</span>
  );

  /**
   * Render the row action cell.
   * @param {EmailSenderData} emailSender - Sender row
   * @returns {React.ReactElement} - Action cell
   */
  const renderActionCell = (emailSender: EmailSenderData): React.ReactElement => _renderActionCell(emailSender, onEdit);

  const columns: TableColumn<EmailSenderData>[] = [
    { key: "no", header: "No", align: "center", render: renderNumberCell },
    { key: "name", header: "Name", render: _renderNameCell },
    { key: "email", header: "Email", render: _renderEmailCell },
    { key: "smtpServer", header: "SMTP Host", render: _renderSmtpServerCell },
    { key: "enableSsl", header: "SSL", align: "center", render: _renderSslCell },
    { key: "isDefault", header: "Default", align: "center", render: _renderDefaultCell },
    { key: "status", header: "Status", align: "center", render: _renderStatusCell },
    { key: "createdAt", header: "Created At", render: _renderCreatedAtCell },
  ];

  if (!canEdit) {
    return columns;
  }

  return [...columns, { key: "actions", header: "Action", align: "center", render: renderActionCell }];
};

/**
 * Get the table row key of an email sender.
 * @param {EmailSenderData} emailSender - Sender row
 * @returns {string} - Row key
 */
export const getEmailSenderRowKey = (emailSender: EmailSenderData): string => emailSender.id;

/**
 * Render one labelled value of the mobile card.
 * @param {string} label - Field label
 * @param {string} value - Field value
 * @param {string} [className=""] - Extra wrapper classes
 * @returns {React.ReactElement} - Card field
 */
const _renderCardField = (label: string, value: string, className: string = ""): React.ReactElement => (
  <span className={`min-w-0 ${className}`}>
    <span className="block text-lg text-text-tertiary">{label}</span>
    <span className="mt-1 block break-all text-lg font-medium text-text-primary">{value}</span>
  </span>
);

/**
 * Render an email sender card for the mobile list; disabled without edit permission.
 * @param {EmailSenderMobileCardProps} props - Sender, edit permission and edit callback
 * @returns {React.ReactElement} - Email sender card
 */
export const renderEmailSenderMobileCard = (props: EmailSenderMobileCardProps): React.ReactElement => {
  const { emailSender, canEdit, onEdit } = props;

  return (
    <button
      key={emailSender.id}
      type="button"
      disabled={!canEdit}
      onClick={_createEditClickHandler(emailSender, onEdit)}
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-default disabled:hover:bg-background-surface"
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{emailSender.name}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${EMAIL_SENDER_STATUS_BADGE_CLASS[emailSender.status]}`}>
          {emailSender.status}
        </span>
      </span>
      <span className="mt-4 grid grid-cols-1 gap-4 border-t border-border-default pt-4 sm:grid-cols-2">
        {_renderCardField("Email", emailSender.email)}
        {_renderCardField("Host", emailSender.smtpServer, "sm:text-right")}
        {_renderCardField("Default sender", EMAIL_SENDER_FLAG_LABEL[emailSender.isDefault])}
        {_renderCardField("Created At", emailSender.createdAt, "sm:text-right")}
      </span>
    </button>
  );
};
