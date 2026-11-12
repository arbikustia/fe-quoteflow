import type * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "@/components/Table";

import { PAYMENT_METHOD_STATUS_BADGE_CLASS } from "./MasterPaymentMethod.config";
import type { PaymentMethodData, PaymentMethodMobileCardProps } from "./MasterPaymentMethod.type";
import { getPaymentMethodRowNumber } from "./MasterPaymentMethod.util";

/**
 * Create an edit click handler that does not bubble up to the table row click.
 * @param {PaymentMethodData} paymentMethod - Payment method of the row
 * @param {(paymentMethod: PaymentMethodData) => void} onEdit - Edit callback
 * @returns {(event: React.MouseEvent<HTMLButtonElement>) => void} - Edit button click handler
 */
export const _createEditClickHandler = (
  paymentMethod: PaymentMethodData,
  onEdit: (paymentMethod: PaymentMethodData) => void,
): ((event: React.MouseEvent<HTMLButtonElement>) => void) => {
  return (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onEdit(paymentMethod);
  };
};

/**
 * Render the payment method name cell.
 * @param {PaymentMethodData} paymentMethod - Payment method row
 * @returns {React.ReactElement} - Name cell
 */
const _renderNameCell = (paymentMethod: PaymentMethodData): React.ReactElement => (
  <span className="text-lg font-medium text-text-primary">{paymentMethod.name}</span>
);

/**
 * Render the payment method description cell.
 * @param {PaymentMethodData} paymentMethod - Payment method row
 * @returns {React.ReactElement} - Description cell
 */
const _renderDescriptionCell = (paymentMethod: PaymentMethodData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{paymentMethod.description}</span>
);

/**
 * Render the payment method status cell.
 * @param {PaymentMethodData} paymentMethod - Payment method row
 * @returns {React.ReactElement} - Status badge cell
 */
const _renderStatusCell = (paymentMethod: PaymentMethodData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${PAYMENT_METHOD_STATUS_BADGE_CLASS[paymentMethod.status]}`}>
    {paymentMethod.status}
  </span>
);

/**
 * Render the created-at cell.
 * @param {PaymentMethodData} paymentMethod - Payment method row
 * @returns {React.ReactElement} - Created-at cell
 */
const _renderCreatedAtCell = (paymentMethod: PaymentMethodData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{paymentMethod.createdAt}</span>
);

/**
 * Render the row action cell.
 * @param {PaymentMethodData} paymentMethod - Payment method row
 * @param {(paymentMethod: PaymentMethodData) => void} onEdit - Edit callback
 * @returns {React.ReactElement} - Action cell
 */
const _renderActionCell = (paymentMethod: PaymentMethodData, onEdit: (paymentMethod: PaymentMethodData) => void): React.ReactElement => (
  <div className="flex items-center justify-center gap-1">
    <button
      type="button"
      onClick={_createEditClickHandler(paymentMethod, onEdit)}
      className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
      title="Edit payment method"
      aria-label={`Edit payment method ${paymentMethod.name}`}
    >
      <FiEdit2 className="h-5 w-5" />
    </button>
  </div>
);

/**
 * Build the payment method table columns; the action column is shown only with edit permission.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {boolean} canEdit - Whether the user may edit payment methods
 * @param {(paymentMethod: PaymentMethodData) => void} onEdit - Edit callback
 * @returns {TableColumn<PaymentMethodData>[]} - Payment method table columns
 */
export const getPaymentMethodColumns = (
  currentPage: number,
  pageSize: number,
  canEdit: boolean,
  onEdit: (paymentMethod: PaymentMethodData) => void,
): TableColumn<PaymentMethodData>[] => {
  /**
   * Render the row number cell.
   * @param {PaymentMethodData} _paymentMethod - Payment method row
   * @param {number} rowIndex - Zero-based row index
   * @returns {React.ReactElement} - Row number cell
   */
  const renderNumberCell = (_paymentMethod: PaymentMethodData, rowIndex: number): React.ReactElement => (
    <span className="text-lg text-text-secondary">{getPaymentMethodRowNumber(currentPage, pageSize, rowIndex)}</span>
  );

  /**
   * Render the row action cell.
   * @param {PaymentMethodData} paymentMethod - Payment method row
   * @returns {React.ReactElement} - Action cell
   */
  const renderActionCell = (paymentMethod: PaymentMethodData): React.ReactElement => _renderActionCell(paymentMethod, onEdit);

  const columns: TableColumn<PaymentMethodData>[] = [
    { key: "no", header: "No", align: "center", render: renderNumberCell },
    { key: "name", header: "Payment Method", render: _renderNameCell },
    { key: "description", header: "Description", render: _renderDescriptionCell },
    { key: "status", header: "Status", align: "center", render: _renderStatusCell },
    { key: "createdAt", header: "Created At", render: _renderCreatedAtCell },
  ];

  if (!canEdit) {
    return columns;
  }

  return [...columns, { key: "actions", header: "Action", align: "center", render: renderActionCell }];
};

/**
 * Get the table row key of a payment method.
 * @param {PaymentMethodData} paymentMethod - Payment method row
 * @returns {string} - Row key
 */
export const getPaymentMethodRowKey = (paymentMethod: PaymentMethodData): string => paymentMethod.id;

/**
 * Render a payment method card for the mobile list; disabled without edit permission.
 * @param {PaymentMethodMobileCardProps} props - Payment method, edit permission and edit callback
 * @returns {React.ReactElement} - Payment method card
 */
export const renderPaymentMethodMobileCard = (props: PaymentMethodMobileCardProps): React.ReactElement => {
  const { paymentMethod, canEdit, onEdit } = props;

  return (
    <button
      key={paymentMethod.id}
      type="button"
      disabled={!canEdit}
      onClick={_createEditClickHandler(paymentMethod, onEdit)}
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-default disabled:hover:bg-background-surface"
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{paymentMethod.name}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${PAYMENT_METHOD_STATUS_BADGE_CLASS[paymentMethod.status]}`}>
          {paymentMethod.status}
        </span>
      </span>
      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
        <span className="min-w-0">
          <span className="block text-lg text-text-tertiary">Description</span>
          <span className="mt-1 block break-words text-lg font-medium text-text-primary">{paymentMethod.description}</span>
        </span>
      </span>
    </button>
  );
};
