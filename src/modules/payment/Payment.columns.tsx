import * as React from "react";
import { FiEdit } from "react-icons/fi";

import type { TableColumn } from "@/components/Table";

import type { PaymentData } from "./Payment.type";

/** Build payment table columns. */
export const getPaymentColumns = (currentPage: number, pageSize: number, onEdit: (payment: PaymentData) => void): TableColumn<PaymentData>[] => [
  { key: "no", header: "No", align: "center", render: (_row, index): React.ReactElement => <span>{(currentPage - 1) * pageSize + index + 1}</span> },
  { key: "referenceNo", header: "Reference No" },
  { key: "invoiceId", header: "Invoice ID" },
  { key: "paymentMethodId", header: "Payment Method" },
  { key: "amount", header: "Amount", align: "right", render: (row): React.ReactElement => <span>{row.amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span> },
  { key: "paidAt", header: "Paid At", render: (row): React.ReactElement => <span>{new Date(row.paidAt).toLocaleString("id-ID")}</span> },
  { key: "notes", header: "Notes" },
  { key: "status", header: "Status", align: "center", render: (row): React.ReactElement => <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{row.status}</span> },
  { key: "actions", header: "Action", align: "center", render: (row): React.ReactElement => <button type="button" aria-label="Edit Payment" title="Edit Payment" onClick={(event): void => { event.stopPropagation(); onEdit(row); }} className="rounded-lg p-1.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"><FiEdit className="h-4 w-4" /></button> },
];
