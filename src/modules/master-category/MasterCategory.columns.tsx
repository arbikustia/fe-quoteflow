import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { CategoryData, GetColumnsParams } from "./MasterCategory.type";
import type { TableColumn } from "../../components/Table";

/**
 * Get columns for master category table
 * @param {GetColumnsParams} params - The parameters
 * @returns {TableColumn<CategoryData>[]} The columns
 */
export const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<CategoryData>[] => [
  {
    key: "no",
    header: "No",
    align: "center",
    render: (_: CategoryData, index: number): React.ReactElement => (
      <span className="text-sm text-brand-text-medium">{(currentPage - 1) * pageSize + index + 1}</span>
    )
  },
  { key: "categoryName", header: "Category Name" },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (row: CategoryData): React.ReactElement => (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
        {row.status}
      </span>
    )
  },
  { key: "createAt", header: "Created At", render: (row: CategoryData): string => row.createAt },
  {
    key: "actions",
    header: "Action",
    align: "center",
    render: (row: CategoryData): React.ReactElement => (
      <button
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); onEdit(row); }}
        className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer"
        title="Edit"
      >
        <FiEdit2 className="w-4 h-4" />
      </button>
    )
  },
];
