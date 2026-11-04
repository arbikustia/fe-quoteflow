import * as React from "react";

import type { CustomerMobileCardProps } from "./MasterCustomer.type";

/**
 * Render customer mobile card footer with address and phone number.
 * @param {CustomerMobileCardProps["customer"]} customer - Customer data
 * @returns {React.ReactElement} Card footer element
 */
const _renderCustomerCardFooter = (customer: CustomerMobileCardProps["customer"]): React.ReactElement =>
  React.createElement(
    "span",
    { className: "mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4" },
    React.createElement(
      "span",
      { className: "min-w-0 text-lg text-text-secondary" },
      React.createElement("span", { className: "block text-lg text-text-tertiary" }, "Address"),
      React.createElement("span", { className: "mt-1 block break-words text-lg font-medium text-text-primary" }, customer.address || "No address provided"),
    ),
    React.createElement(
      "span",
      { className: "text-right" },
      React.createElement("span", { className: "block text-lg text-text-tertiary" }, "Phone Number"),
      React.createElement("span", { className: "mt-1 block text-lg font-medium text-text-primary" }, customer.phoneNumber || "No phone number"),
    ),
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

  const isActive = customer.status === "active";
  const badgeClass = isActive ? "bg-badge-success-subtle text-badge-success" : "bg-badge-danger-subtle text-badge-danger";

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
      React.createElement("span", { className: "min-w-0 break-words text-xl font-semibold text-text-primary" }, customer.name),
      React.createElement("span", { className: `rounded-full px-3.5 py-1 text-lg font-semibold uppercase ${badgeClass}` }, customer.status),
    ),
    _renderCustomerCardFooter(customer),
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
