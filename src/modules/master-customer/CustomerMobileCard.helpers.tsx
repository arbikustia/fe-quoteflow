import * as React from "react";
import { FiChevronRight, FiEdit2, FiMapPin, FiPhone, FiUser } from "react-icons/fi";

import type { CustomerData, CustomerMobileCardProps } from "./MasterCustomer.type";

/**
 * Render customer identity.
 * @param {CustomerData} customer - Customer data
 * @returns {React.ReactElement} Identity node
 */
const _renderIdentity = (customer: CustomerData): React.ReactElement => (
  <div className="flex items-center gap-2.5 min-w-0">
    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue font-bold flex items-center justify-center shrink-0 text-sm">
      {customer.name.charAt(0).toUpperCase()}
    </div>
    <div className="min-w-0">
      <h4 className="text-base font-semibold text-text-primary truncate">{customer.name}</h4>
      <span className="text-xs text-text-tertiary flex items-center gap-1 mt-0.5"><FiUser className="w-3.5 h-3.5 shrink-0" /><span>ID: {customer.id.slice(0, 8)}</span></span>
    </div>
  </div>
);

/**
 * Render customer details.
 * @param {CustomerData} customer - Customer data
 * @returns {React.ReactElement} Details node
 */
const _renderDetails = (customer: CustomerData): React.ReactElement => (
  <div className="grid grid-cols-1 gap-1.5 pt-2 border-t border-border-default/60 text-sm text-text-secondary">
    <div className="flex items-center gap-2 truncate"><FiMapPin className="w-4 h-4 text-text-tertiary shrink-0" /><span className="truncate">{customer.address || "No address provided"}</span></div>
    <div className="flex items-center gap-2 truncate"><FiPhone className="w-4 h-4 text-text-tertiary shrink-0" /><span className="truncate">{customer.phoneNumber || "No phone number"}</span></div>
  </div>
);

/**
 * Render card header actions.
 * @param {CustomerData} customer - Customer data
 * @param {CustomerMobileCardProps["onEdit"]} onEdit - Edit callback
 * @returns {React.ReactElement} Header node
 */
const _renderHeader = (customer: CustomerData, onEdit: CustomerMobileCardProps["onEdit"]): React.ReactElement => {
/**
   * Handle edit click
   * @param {React.MouseEvent} event - Mouse event
   * @returns {void}
   */
  const handleEdit = (event: React.MouseEvent): void => { event.stopPropagation(); onEdit(customer); };

  return (
    <div className="flex items-start justify-between gap-2">
      {_renderIdentity(customer)}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${customer.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{customer.status}</span>
        <button type="button" onClick={handleEdit} className="p-1.5 text-text-tertiary hover:text-brand-blue hover:bg-background-subtle rounded-lg transition-colors cursor-pointer" aria-label="Edit customer" title="Edit"><FiEdit2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

/**
 * Render single customer card on mobile.
 * @param {CustomerMobileCardProps} props - Props for card
 * @returns {React.ReactElement} Card node
 */
export const CustomerMobileCard = ({ customer, onRowClick, onEdit }: CustomerMobileCardProps): React.ReactElement => {
  /**
   * Handle card click
   * @returns {void}
   */
  const handleClick = (): void => onRowClick(customer);

  return (
    <div onClick={handleClick} className="bg-background-surface rounded-2xl border border-border-default p-4 shadow-xs flex flex-col gap-3 active:bg-background-subtle/50 transition-colors cursor-pointer" role="button" tabIndex={0}>
      {_renderHeader(customer, onEdit)}
      {_renderDetails(customer)}
      <div className="flex items-center justify-end text-xs font-medium text-brand-blue pt-1"><span className="flex items-center gap-1">Lihat detail <FiChevronRight className="w-3.5 h-3.5" /></span></div>
    </div>
  );
};
