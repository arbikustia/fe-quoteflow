import type * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "@/components/Table";

import { ORDER_TYPE_HANDOVER_BADGE_CLASS, ORDER_TYPE_HANDOVER_LABEL, ORDER_TYPE_STATUS_BADGE_CLASS } from "./MasterOrderType.config";
import type { OrderTypeData, OrderTypeMobileCardProps } from "./MasterOrderType.type";
import { getOrderTypeRowNumber } from "./MasterOrderType.util";

/**
 * Create an edit click handler that does not bubble up to the table row click.
 * @param {OrderTypeData} orderType - Order type of the row
 * @param {(orderType: OrderTypeData) => void} onEdit - Edit callback
 * @returns {(event: React.MouseEvent<HTMLButtonElement>) => void} - Edit button click handler
 */
export const _createEditClickHandler = (
  orderType: OrderTypeData,
  onEdit: (orderType: OrderTypeData) => void,
): ((event: React.MouseEvent<HTMLButtonElement>) => void) => {
  return (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onEdit(orderType);
  };
};

/**
 * Render the order type name cell.
 * @param {OrderTypeData} orderType - Order type row
 * @returns {React.ReactElement} - Name cell
 */
const _renderNameCell = (orderType: OrderTypeData): React.ReactElement => (
  <span className="text-lg font-medium text-text-primary">{orderType.name}</span>
);

/**
 * Render the handover flag cell.
 * @param {OrderTypeData} orderType - Order type row
 * @returns {React.ReactElement} - Handover badge cell
 */
const _renderHandoverCell = (orderType: OrderTypeData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${ORDER_TYPE_HANDOVER_BADGE_CLASS[orderType.isHandover]}`}>
    {orderType.isHandover}
  </span>
);

/**
 * Render the order type status cell.
 * @param {OrderTypeData} orderType - Order type row
 * @returns {React.ReactElement} - Status badge cell
 */
const _renderStatusCell = (orderType: OrderTypeData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${ORDER_TYPE_STATUS_BADGE_CLASS[orderType.status]}`}>
    {orderType.status}
  </span>
);

/**
 * Render the created-at cell.
 * @param {OrderTypeData} orderType - Order type row
 * @returns {React.ReactElement} - Created-at cell
 */
const _renderCreatedAtCell = (orderType: OrderTypeData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{orderType.createdAt}</span>
);

/**
 * Render the row action cell.
 * @param {OrderTypeData} orderType - Order type row
 * @param {(orderType: OrderTypeData) => void} onEdit - Edit callback
 * @returns {React.ReactElement} - Action cell
 */
const _renderActionCell = (orderType: OrderTypeData, onEdit: (orderType: OrderTypeData) => void): React.ReactElement => (
  <div className="flex items-center justify-center gap-1">
    <button
      type="button"
      onClick={_createEditClickHandler(orderType, onEdit)}
      className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
      title="Edit order type"
      aria-label={`Edit order type ${orderType.name}`}
    >
      <FiEdit2 className="h-5 w-5" />
    </button>
  </div>
);

/**
 * Build the order type table columns; the action column is shown only with edit permission.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {boolean} canEdit - Whether the user may edit order types
 * @param {(orderType: OrderTypeData) => void} onEdit - Edit callback
 * @returns {TableColumn<OrderTypeData>[]} - Order type table columns
 */
export const getOrderTypeColumns = (
  currentPage: number,
  pageSize: number,
  canEdit: boolean,
  onEdit: (orderType: OrderTypeData) => void,
): TableColumn<OrderTypeData>[] => {
  /**
   * Render the row number cell.
   * @param {OrderTypeData} _orderType - Order type row
   * @param {number} rowIndex - Zero-based row index
   * @returns {React.ReactElement} - Row number cell
   */
  const renderNumberCell = (_orderType: OrderTypeData, rowIndex: number): React.ReactElement => (
    <span className="text-lg text-text-secondary">{getOrderTypeRowNumber(currentPage, pageSize, rowIndex)}</span>
  );

  /**
   * Render the row action cell.
   * @param {OrderTypeData} orderType - Order type row
   * @returns {React.ReactElement} - Action cell
   */
  const renderActionCell = (orderType: OrderTypeData): React.ReactElement => _renderActionCell(orderType, onEdit);

  const columns: TableColumn<OrderTypeData>[] = [
    { key: "no", header: "No", align: "center", render: renderNumberCell },
    { key: "name", header: "Order Type Name", render: _renderNameCell },
    { key: "isHandover", header: "Handover", align: "center", render: _renderHandoverCell },
    { key: "status", header: "Status", align: "center", render: _renderStatusCell },
    { key: "createdAt", header: "Created At", render: _renderCreatedAtCell },
  ];

  if (!canEdit) {
    return columns;
  }

  return [...columns, { key: "actions", header: "Action", align: "center", render: renderActionCell }];
};

/**
 * Get the table row key of an order type.
 * @param {OrderTypeData} orderType - Order type row
 * @returns {string} - Row key
 */
export const getOrderTypeRowKey = (orderType: OrderTypeData): string => orderType.id;

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
    <span className="mt-1 block text-lg font-medium text-text-primary">{value}</span>
  </span>
);

/**
 * Render an order type card for the mobile list; disabled without edit permission.
 * @param {OrderTypeMobileCardProps} props - Order type, edit permission and edit callback
 * @returns {React.ReactElement} - Order type card
 */
export const renderOrderTypeMobileCard = (props: OrderTypeMobileCardProps): React.ReactElement => {
  const { orderType, canEdit, onEdit } = props;

  return (
    <button
      key={orderType.id}
      type="button"
      disabled={!canEdit}
      onClick={_createEditClickHandler(orderType, onEdit)}
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-default disabled:hover:bg-background-surface"
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{orderType.name}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${ORDER_TYPE_STATUS_BADGE_CLASS[orderType.status]}`}>
          {orderType.status}
        </span>
      </span>
      <span className="mt-4 grid grid-cols-2 gap-4 border-t border-border-default pt-4">
        {_renderCardField("Handover", ORDER_TYPE_HANDOVER_LABEL[orderType.isHandover])}
        {_renderCardField("Created At", orderType.createdAt, "text-right")}
      </span>
    </button>
  );
};
