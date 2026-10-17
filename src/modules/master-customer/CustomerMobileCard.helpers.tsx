import * as React from "react";
import { FiMapPin, FiPhone } from "react-icons/fi";

import type { CustomerData, CustomerMobileCardProps } from "./MasterCustomer.type";

/**
 * Render customer identity.
 * @param {CustomerData} customer - Customer data
 * @returns {React.ReactElement} Identity node
 */
const _renderIdentity = (customer: CustomerData): React.ReactElement => (
  <div className="min-w-0">
    <h4 className="text-base font-semibold text-text-primary truncate">{customer.name}</h4>
  </div>
);

/**
 * Render customer details.
 * @param {CustomerData} customer - Customer data
 * @returns {React.ReactElement} Details node
 */
const _renderDetails = (customer: CustomerData): React.ReactElement => (
  <div className="grid grid-cols-1 gap-2 rounded-xl bg-background-subtle/60 p-3 text-sm text-text-secondary">
    <div className="flex items-center gap-2.5 truncate">
      <div className="w-7 h-7 rounded-lg bg-background-surface flex items-center justify-center text-text-tertiary shrink-0">
        <FiMapPin className="w-3.5 h-3.5" />
      </div>
      <span className="truncate font-medium text-text-primary">{customer.address || "No address provided"}</span>
    </div>
    <div className="flex items-center gap-2.5 truncate">
      <div className="w-7 h-7 rounded-lg bg-background-surface flex items-center justify-center text-text-tertiary shrink-0">
        <FiPhone className="w-3.5 h-3.5" />
      </div>
      <span className="truncate font-medium text-text-primary">{customer.phoneNumber || "No phone number"}</span>
    </div>
  </div>
);

/**
 * Render card header actions.
 * @param {CustomerData} customer - Customer data
 * @param {CustomerMobileCardProps["onEdit"]} onEdit - Edit callback
 * @returns {React.ReactElement} Header node
 */
const _renderHeader = (customer: CustomerData): React.ReactElement => (
  <div className="flex items-start justify-between gap-3">
    {_renderIdentity(customer)}
    <div className="flex items-center gap-2 shrink-0">
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${customer.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
        {customer.status}
      </span>
    </div>
  </div>
);

/**
 * Render single customer card on mobile.
 * @param {CustomerMobileCardProps} props - Props for card
 * @returns {React.ReactElement} Card node
 */
export const CustomerMobileCard = ({ customer, isDetail = false, onEdit, onDetail }: CustomerMobileCardProps): React.ReactElement => {
  /**
   * Handle card click
   * @returns {void}
   */
  const handleClick = (): void => {
    if (isDetail) {
      onDetail(customer);
    } else {
      onEdit(customer);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-background-surface rounded-3xl border border-border-default p-5 flex flex-col gap-4 transition-all hover:border-border-strong active:bg-background-subtle/50 cursor-pointer"
      role="button"
      tabIndex={0}
    >
      {_renderHeader(customer)}
      {_renderDetails(customer)}
    </div>
  );
};
