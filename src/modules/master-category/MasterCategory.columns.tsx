import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { CategoryData, GetColumnsParams } from "./MasterCategory.type";
import type { TableColumn } from "../../components/Table";

/**
 * Get columns for master category table.
 * @param {GetColumnsParams} params - Column parameters
 * @returns {TableColumn<CategoryData>[]} Table columns
 */
export const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<CategoryData>[] => {
  const renderNo = (_row: CategoryData, index: number): React.ReactElement => (
    <span className="text-sm">{(currentPage - 1) * pageSize + index + 1}</span>
  );
  const renderStatus = (row: CategoryData): React.ReactElement => (
    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
      {row.status}
    </span>
  );
  const renderActions = (row: CategoryData): React.ReactElement => {
    const handleEdit = (event: React.MouseEvent): void => {
      event.stopPropagation();
      onEdit(row);
    };

    return (
      <button type="button" onClick={handleEdit} className="cursor-pointer rounded-lg p-1.5 text-brand-text-medium transition-colors hover:bg-brand-blue-light hover:text-brand-blue" title="Edit">
        <FiEdit2 className="h-4 w-4" />
      </button>
    );
  };

  return [
    { key: "no", header: "No", align: "center", render: renderNo },
    { key: "categoryName", header: "Category Name", mobile: { primary: true } },
    { key: "status", header: "Status", align: "center", mobile: { primary: true, render: renderStatus }, render: renderStatus },
    { key: "createAt", header: "Created At" },
    { key: "actions", header: "Action", align: "center", render: renderActions },
  ];
};
