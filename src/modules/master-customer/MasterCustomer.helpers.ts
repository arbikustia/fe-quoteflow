import * as React from "react";

import { MasterDataCard } from "../../components/MasterDataCard";

import type { CustomerData, CustomerMobileCardProps } from "./MasterCustomer.type";

/**
 * Render customer details.
 * @param {CustomerData} customer - Customer data
 * @returns {React.ReactElement} Details node
 */
const _renderDetails = (customer: CustomerData): React.ReactElement => React.createElement(
  "span",
  { className: "grid gap-1 text-sm text-text-secondary" },
  React.createElement("span", { className: "truncate" }, customer.address || "No address provided"),
  React.createElement("span", { className: "truncate" }, customer.phoneNumber || "No phone number"),
);

/**
 * Render single customer card on mobile.
 * @param {CustomerMobileCardProps} props - Customer card props
 * @returns {React.ReactElement} Customer card
 */
export const CustomerMobileCard = (props: CustomerMobileCardProps): React.ReactElement => {
  const { customer, onEdit } = props;

  /**
   * Handle customer card click.
   * @returns {void} No return value
   */
  const handleClick = (): void => {
    onEdit(customer);
  };

  return React.createElement(
    MasterDataCard,
    { title: customer.name, status: customer.status, onClick: handleClick, children: _renderDetails(customer) },
  );
};

/**
 * Calculate customer table row number.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} Display row number
 */
export const getCustomerRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number => (currentPage - 1) * pageSize + rowIndex + 1;
