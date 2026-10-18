import * as React from "react";

import { MasterDataCard } from "../../components/MasterDataCard";

import type { CustomerData, CustomerMobileCardProps } from "./MasterCustomer.type";

/**
 * Render customer details.
 * @param {CustomerData} customer - Customer data
 * @returns {React.ReactElement} Details node
 */
const _renderDetails = (customer: CustomerData): React.ReactElement => (
  <span className="grid gap-1 text-sm text-text-secondary">
    <span className="truncate">{customer.address || "No address provided"}</span>
    <span className="truncate">{customer.phoneNumber || "No phone number"}</span>
  </span>
);

/**
 * Render single customer card on mobile.
 * @param {CustomerMobileCardProps} props - Props for card
 * @returns {React.ReactElement} Card node
 */
export const CustomerMobileCard = (props: CustomerMobileCardProps): React.ReactElement => {
  const { customer, isDetail = false, onEdit, onDetail } = props;

  /**
   * Handle card click
   * @returns {void}
   */
  const handleClick = (): void => {
    const handleAction = isDetail ? onDetail : onEdit;

    handleAction(customer);
  };

  return (
    <MasterDataCard title={customer.name} status={customer.status} onClick={handleClick}>
      {_renderDetails(customer)}
    </MasterDataCard>
  );
};
