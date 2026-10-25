import * as React from "react";
import { FiEye } from "react-icons/fi";

import { SwitchComponent } from "@/components/Switch";
import type { TableColumn } from "@/components/Table";

import type { InvoiceData } from "./Invoice.type";

/** Build invoice table columns. */
export const getInvoiceColumns = (
  currentPage: number,
  pageSize: number,
  updatingInvoiceId: string | null,
  onStatusChange: (invoice: InvoiceData, isActive: boolean) => Promise<void>,
  onDetail: (invoice: InvoiceData) => void,
): TableColumn<InvoiceData>[] => [
  { key: "no", header: "No", align: "center", render: (_row, index): React.ReactElement => <span>{(currentPage - 1) * pageSize + index + 1}</span> },
  { key: "invoiceNumber", header: "Invoice No" },
  { key: "invoiceDate", header: "Invoice Date" },
  { key: "dueDate", header: "Due Date" },
  { key: "name", header: "Event Name" },
  { key: "customerPhone", header: "Customer Phone" },
  { key: "location", header: "Address" },
  { key: "startDate", header: "Start Date" },
  { key: "endDate", header: "End Date" },
  { key: "grandTotal", header: "Grand Total", align: "right", render: (row): React.ReactElement => <span>{row.grandTotal.toLocaleString("id-ID")}</span> },
  { key: "notes", header: "Notes" },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (row: InvoiceData): React.ReactElement => {
      const isUpdating = updatingInvoiceId === row.id;
      const handleToggle = (checked: boolean): void => { void onStatusChange(row, checked); };

      return (
        <div className="flex items-center justify-center" onClick={(event): void => event.stopPropagation()}>
          <SwitchComponent label={`Toggle status for ${row.invoiceNumber}`} checked={row.status === 1} loading={isUpdating} disabled={isUpdating} onChange={handleToggle} />
        </div>
      );
    },
  },
  {
    key: "actions",
    header: "Action",
    align: "center",
    render: (row: InvoiceData): React.ReactElement => (
      <button type="button" onClick={(): void => onDetail(row)} className="rounded-lg p-1.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary" title="View Detail" aria-label="View Detail">
        <FiEye className="h-4 w-4" />
      </button>
    ),
  },
];