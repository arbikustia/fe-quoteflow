import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "../../components/Table";
import type { GetColumnsParams, ItemData } from "./MasterItem.type";

const renderStatus = (row: ItemData): React.ReactElement => <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{row.status}</span>;

export const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<ItemData>[] => [
  { key: "no", header: "No", align: "center", render: (_row, index) => <span className="text-sm">{(currentPage - 1) * pageSize + index + 1}</span> },
  { key: "image", header: "Image", align: "center", render: (row) => row.image ? <img src={row.image} alt={row.name} className="mx-auto h-10 w-10 rounded-lg object-cover" /> : <span>-</span> },
  { key: "name", header: "Item Name", mobile: { primary: true } },
  { key: "categoryId", header: "Category" },
  { key: "price", header: "Price", render: (row) => `Rp ${row.price.toLocaleString("id-ID")}` },
  { key: "stock", header: "Stock", align: "center" },
  { key: "duration", header: "Duration", align: "center" },
  { key: "status", header: "Status", align: "center", render: renderStatus },
  { key: "remark", header: "Remark" },
  { key: "actions", header: "Action", align: "center", render: (row) => <button type="button" onClick={(event) => { event.stopPropagation(); onEdit(row); }} className="rounded-lg p-1.5 text-brand-text-medium hover:bg-brand-blue-light hover:text-brand-blue" title="Edit"><FiEdit2 className="h-4 w-4" /></button> },
];
