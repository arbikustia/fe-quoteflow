import * as React from "react";
import { FiEdit2, FiEye } from "react-icons/fi";

import { SwitchComponent } from "@/components/Switch";
import type { TableColumn } from "@/components/Table";

import { getQuotationRowNumber } from "./Quotation.helpers";
import type { QuotationColumnParams, QuotationData } from "./Quotation.type";

/**
 * Render status switch cell.
 * @param {QuotationData} row - Quotation item
 * @param {string | null} updatingId - Current updating row id
 * @param {(row: QuotationData, checked: boolean) => Promise<void>} onChange - Handler
 * @returns {React.ReactElement} Switch cell
 */
const _renderStatusCell = (
  row: QuotationData,
  updatingId: string | null,
  onChange: (row: QuotationData, checked: boolean) => Promise<void>,
): React.ReactElement => {
  const isRowUpdating = updatingId === row.id;

  /**
   * Handle toggle switch.
   * @param {boolean} checked - Next switch checked state
   * @returns {void}
   */
  const handleToggle = (checked: boolean): void => {
    void onChange(row, checked);
  };

  return (
    <div className="flex items-center justify-center" onClick={(event): void => event.stopPropagation()}>
      <SwitchComponent
        label={`Toggle status for ${row.name}`}
        checked={row.status === 1}
        loading={isRowUpdating}
        disabled={isRowUpdating}
        onChange={handleToggle}
      />
    </div>
  );
};

/**
 * Build quotation columns matching Order table layout plus status switch.
 * @param {QuotationColumnParams} params - Column configuration
 * @returns {TableColumn<QuotationData>[]} Quotation columns
 */
export const getColumns = ({
  currentPage,
  pageSize,
  updatingQuotationId,
  onEdit,
  onDetail,
  onStatusChange,
}: QuotationColumnParams): TableColumn<QuotationData>[] => [
  {
    key: "no",
    header: "No",
    align: "center",
    render: (_row: QuotationData, index: number): React.ReactElement => (
      <span>{getQuotationRowNumber(currentPage, pageSize, index)}</span>
    ),
  },
  { key: "name", header: "Event Name" },
  { key: "customerPhone", header: "Customer Phone" },
  { key: "location", header: "Address" },
  { key: "startDate", header: "Start Date" },
  { key: "endDate", header: "End Date" },
  {
    key: "grandTotal",
    header: "Grand Total",
    align: "right",
    render: (row: QuotationData): React.ReactElement => (
      <span>{row.grandTotal.toLocaleString("id-ID")}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (row: QuotationData): React.ReactElement => _renderStatusCell(row, updatingQuotationId, onStatusChange),
  },
  {
    key: "actions",
    header: "Action",
    align: "center",
    render: (row: QuotationData): React.ReactElement => (
      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={(): void => onDetail(row)}
          className="rounded-lg p-1.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
          title="View Detail"
          aria-label="View Detail"
        >
          <FiEye className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={(): void => onEdit(row)}
          className="rounded-lg p-1.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
          title="Edit quotation"
          aria-label="Edit quotation"
        >
          <FiEdit2 className="h-4 w-4" />
        </button>
      </div>
    ),
  },
];
