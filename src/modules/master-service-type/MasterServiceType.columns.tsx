import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "../../components/Table";

import type { GetColumnsParams, ServiceTypeData } from "./MasterServiceType.type";

/**
 * Render No
 * @param {_row} _row - data
 * @param {number} index - index
 * @param {number} currentPage - current page
 * @param {number} pageSize - page size
 * @returns {React.ReactElement} span
 */
const _renderNo = (_row: ServiceTypeData, index: number, currentPage: number, pageSize: number): React.ReactElement => (
  <span className="text-sm text-brand-text-medium font-medium">
    {(currentPage - 1) * pageSize + index + 1}
  </span>
);

/**
 * Render Price
 * @param {ServiceTypeData} row - data
 * @returns {React.ReactElement} span
 */
const _renderPrice = (row: ServiceTypeData): React.ReactElement => (
  <span>Rp {row.price.toLocaleString("id-ID")}</span>
);

/**
 * Render IsActive
 * @param {ServiceTypeData} row - data
 * @returns {React.ReactElement} span
 */
const _renderIsActive = (row: ServiceTypeData): React.ReactElement => (
  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${row.isActive ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
    {row.isActive ? "Yes" : "No"}
  </span>
);

/**
 * Render Status
 * @param {ServiceTypeData} row - data
 * @returns {React.ReactElement} span
 */
const _renderStatus = (row: ServiceTypeData): React.ReactElement => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
    {row.status}
  </span>
);

/**
 * Get Basic Columns
 * @param {number} currentPage - current page
 * @param {number} pageSize - page size
 * @returns {TableColumn<ServiceTypeData>[]} columns
 */
const _getBasicColumns = (currentPage: number, pageSize: number): TableColumn<ServiceTypeData>[] => {
  /**
   * Render No wrapper
   * @param {ServiceTypeData} _row - data
   * @param {number} index - index
   * @returns {React.ReactElement} cell
   */
  const renderNoWrapper = (_row: ServiceTypeData, index: number): React.ReactElement => _renderNo(_row, index, currentPage, pageSize);

  return [
    {
      key: "no",
      header: "No",
      align: "center",
      render: renderNoWrapper,
    },
    { key: "name", header: "Service Name" },
    {
      key: "price",
      header: "Price",
      render: _renderPrice,
    },
    {
      key: "isActive",
      header: "Active",
      align: "center",
      render: _renderIsActive,
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: _renderStatus,
    },
    { key: "createAt", header: "Created At" },
  ];
};

/**
 * Get Columns
 * @param {GetColumnsParams} params - params
 * @returns {TableColumn<ServiceTypeData>[]} columns
 */
export const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<ServiceTypeData>[] => {
  /**
   * Render actions
   * @param {ServiceTypeData} row - row
   * @returns {React.ReactElement} action
   */
  const renderActions = (row: ServiceTypeData): React.ReactElement => {
    /**
     * Handle click
     * @param {React.MouseEvent} e - event
     * @returns {void} void
     */
    const handleClick = (e: React.MouseEvent): void => {
      e.stopPropagation();
      onEdit(row);
    };

    return (
      <div className="flex items-center justify-center">
        <button
          onClick={handleClick}
          className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer"
          title="Edit"
        >
          <FiEdit2 className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return [
    ..._getBasicColumns(currentPage, pageSize),
    {
      key: "actions",
      header: "Action",
      align: "center",
      render: renderActions,
    },
  ];
};
