import type * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "@/components/Table";

import { CUSTOMER_STATUS_BADGE_CLASS } from "./MasterCustomer.config";
import type { CustomerData, CustomerMobileCardProps } from "./MasterCustomer.type";
import { getCustomerRowNumber } from "./MasterCustomer.util";

/**
 * Create an edit click handler that does not bubble up to the table row click.
 * @param {CustomerData} customer - Customer of the row
 * @param {(customer: CustomerData) => void} onEdit - Edit callback
 * @returns {(event: React.MouseEvent<HTMLButtonElement>) => void} - Edit button click handler
 */
export const _createEditClickHandler = (
  customer: CustomerData,
  onEdit: (customer: CustomerData) => void,
): ((event: React.MouseEvent<HTMLButtonElement>) => void) => {
  return (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onEdit(customer);
  };
};

/**
 * Render the customer name cell.
 * @param {CustomerData} customer - Customer row
 * @returns {React.ReactElement} - Name cell
 */
const _renderNameCell = (customer: CustomerData): React.ReactElement => (
  <span className="text-lg font-medium">{customer.name}</span>
);

/**
 * Render the customer email cell.
 * @param {CustomerData} customer - Customer row
 * @returns {React.ReactElement} - Email cell
 */
const _renderEmailCell = (customer: CustomerData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{customer.email}</span>
);

/**
 * Render the customer address cell.
 * @param {CustomerData} customer - Customer row
 * @returns {React.ReactElement} - Address cell
 */
const _renderAddressCell = (customer: CustomerData): React.ReactElement => (
  <span className="text-lg">{customer.address}</span>
);

/**
 * Render the customer phone number cell.
 * @param {CustomerData} customer - Customer row
 * @returns {React.ReactElement} - Phone number cell
 */
const _renderPhoneNumberCell = (customer: CustomerData): React.ReactElement => (
  <span className="text-lg">{customer.phoneNumber}</span>
);

/**
 * Render the customer status cell.
 * @param {CustomerData} customer - Customer row
 * @returns {React.ReactElement} - Status badge cell
 */
const _renderStatusCell = (customer: CustomerData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${CUSTOMER_STATUS_BADGE_CLASS[customer.status]}`}>
    {customer.status}
  </span>
);

/**
 * Build the customer table columns.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {(customer: CustomerData) => void} onEdit - Edit callback
 * @returns {TableColumn<CustomerData>[]} - Customer table columns
 */
export const getCustomerColumns = (
  currentPage: number,
  pageSize: number,
  onEdit: (customer: CustomerData) => void,
): TableColumn<CustomerData>[] => {
  /**
   * Render the row number cell.
   * @param {CustomerData} _customer - Customer row
   * @param {number} rowIndex - Zero-based row index
   * @returns {React.ReactElement} - Row number cell
   */
  const renderNumberCell = (_customer: CustomerData, rowIndex: number): React.ReactElement => (
    <span className="text-lg">{getCustomerRowNumber(currentPage, pageSize, rowIndex)}</span>
  );

  /**
   * Render the row action cell.
   * @param {CustomerData} customer - Customer row
   * @returns {React.ReactElement} - Action cell
   */
  const renderActionCell = (customer: CustomerData): React.ReactElement => (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={_createEditClickHandler(customer, onEdit)}
        className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
        title="Edit customer"
        aria-label="Edit customer"
      >
        <FiEdit2 className="h-5 w-5" />
      </button>
    </div>
  );

  return [
    { key: "no", header: "No", align: "center", render: renderNumberCell },
    { key: "name", header: "Customer Name", render: _renderNameCell },
    { key: "email", header: "Email", render: _renderEmailCell },
    { key: "address", header: "Address", render: _renderAddressCell },
    { key: "phoneNumber", header: "Phone Number", render: _renderPhoneNumberCell },
    { key: "status", header: "Status", align: "center", render: _renderStatusCell },
    { key: "actions", header: "Action", align: "center", render: renderActionCell },
  ];
};

/**
 * Get the table row key of a customer.
 * @param {CustomerData} customer - Customer row
 * @returns {string} - Row key
 */
export const getCustomerRowKey = (customer: CustomerData): string => customer.id;

/**
 * Render a customer card for the mobile list.
 * @param {CustomerMobileCardProps} props - Customer and edit callback
 * @returns {React.ReactElement} - Customer card
 */
export const renderCustomerMobileCard = (props: CustomerMobileCardProps): React.ReactElement => {
  const { customer, onEdit } = props;

  return (
    <button
      key={customer.id}
      type="button"
      onClick={_createEditClickHandler(customer, onEdit)}
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{customer.name}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${CUSTOMER_STATUS_BADGE_CLASS[customer.status]}`}>
          {customer.status}
        </span>
      </span>
      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
        <span className="min-w-0">
          <span className="block text-lg text-text-tertiary">Email</span>
          <span className="mt-1 block break-all text-lg font-medium text-text-primary">{customer.email}</span>
          <span className="mt-3 block text-lg text-text-tertiary">Address</span>
          <span className="mt-1 block break-words text-lg font-medium text-text-primary">{customer.address}</span>
        </span>
        <span className="text-right">
          <span className="block text-lg text-text-tertiary">Phone</span>
          <span className="mt-1 block text-lg font-medium text-text-primary">{customer.phoneNumber}</span>
        </span>
      </span>
    </button>
  );
};
