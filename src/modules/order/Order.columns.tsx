import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "../../components/Table";

import type { GetColumnsParams, QuoteData } from "./Order.type";

export const getColumns = ({ currentPage, pageSize, openEditModal }: GetColumnsParams): TableColumn<QuoteData>[] => [
  {
    key: "no",
    header: "No",
    align: "center",
    render: (_row: QuoteData, index: number): React.ReactElement => <span>{(currentPage - 1) * pageSize + index + 1}</span>,
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
    render: (row: QuoteData): React.ReactElement => <span>{row.grandTotal.toLocaleString("id-ID")}</span>,
  },
  {
    key: "actions",
    header: "Action",
    align: "center",
    render: (row: QuoteData): React.ReactElement => (
      <button type="button" onClick={(): void => openEditModal(row)} className="rounded-lg p-1.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary" title="Edit order">
        <FiEdit2 className="h-4 w-4" />
      </button>
    ),
  },
];
