import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "../../components/Table";

import type { CustomerData,GetColumnsParams } from "./MasterCustomer.type";

/**
 * Get columns for master customer table
 * @param {GetColumnsParams} params - The parameters for generating columns
 * @returns {TableColumn<CustomerData>[]} The table columns
 */
export const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<CustomerData>[] => {
  /**
   * Render number column
   * @param {CustomerData} _row - The row data
   * @param {number} index - The row index
   * @returns {React.ReactElement} The number cell
   */
  const renderNo = (_row: CustomerData, index: number): React.ReactElement => (
    <span className="text-sm">{(currentPage - 1) * pageSize + index + 1}</span>
  );

  /**
   * Render status column
   * @param {CustomerData} row - The row data
   * @returns {React.ReactElement} The status cell
   */
  const renderStatus = (row: CustomerData): React.ReactElement => (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
      {row.status}
    </span>
  );

  /**
   * Render actions column
   * @param {CustomerData} row - The row data
   * @returns {React.ReactElement} The actions cell
   */
  const renderActions = (row: CustomerData): React.ReactElement => {
    /**
     * Handle edit
     * @param {React.MouseEvent} e - The mouse event
     * @returns {void}
     */
    const handleEdit = (e: React.MouseEvent): void => {
      e.stopPropagation();
      onEdit(row);
    };

    return (
      <button
        onClick={handleEdit}
        className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer"
        title="Edit"
      >
        <FiEdit2 className="w-4 h-4" />
      </button>
    );
  };

  return [
    { key: "no", header: "No", align: "center", render: renderNo },
    { key: "name", header: "Customer Name" },
    { key: "address", header: "Address" },
    { key: "phoneNumber", header: "Phone Number" },
    { key: "status", header: "Status", align: "center", render: renderStatus },
    { key: "actions", header: "Action", align: "center", render: renderActions },
  ];
};
