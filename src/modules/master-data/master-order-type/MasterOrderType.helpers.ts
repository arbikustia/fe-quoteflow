import * as React from "react";

import { MasterDataCard } from "../../../components/MasterDataCard";

import type { OrderTypeData, OrderTypeMobileCardProps } from "./MasterOrderType.type";

/**
 * Render order type details.
 *
 * @param {OrderTypeData} orderType - Order type data
 * @returns {React.ReactElement} Details node
 */
const _renderDetails = (orderType: OrderTypeData): React.ReactElement =>
  React.createElement(
    "span",
    { className: "grid gap-1 text-lg text-text-secondary" },
    React.createElement(
      "span",
      { className: "truncate" },
      orderType.isHandover ? "Handover Required" : "No Handover",
    ),
  );

/**
 * Render single order type card on mobile.
 *
 * @param {OrderTypeMobileCardProps} props - Order type card props
 * @returns {React.ReactElement} Order type card
 */
export const OrderTypeMobileCard = (props: OrderTypeMobileCardProps): React.ReactElement => {
  const { orderType, onEdit } = props;

    /**
   * Handle card click.
   *
   * @returns {void} No return value
   */
  const handleClick = (): void => {
    onEdit(orderType);
  };

  return React.createElement(
    MasterDataCard,
    {
      title: orderType.name,
      status: orderType.status,
      onClick: handleClick,
      isLargeText: true,
      children: _renderDetails(orderType),
    },
  );
};

/**
 * Calculate order type table row number.
 *
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} Display row number
 */
export const getOrderTypeRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number =>
  (currentPage - 1) * pageSize + rowIndex + 1;
