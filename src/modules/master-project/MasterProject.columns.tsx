import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "../../components/Table";
import { MOCK_ITEMS } from "../../fixture/master-item";

import type { GetColumnsParams, ProjectData } from "./MasterProject.type";

/**
 * Render No
 * @param {_row} _row - data
 * @param {number} index - index
 * @param {number} currentPage - current page
 * @param {number} pageSize - page size
 * @returns {React.ReactElement} span
 */
const _renderNo = (_row: ProjectData, index: number, currentPage: number, pageSize: number): React.ReactElement => (
  <span className="text-brand-text-medium font-medium text-sm">
    {(currentPage - 1) * pageSize + index + 1}
  </span>
);

/**
 * Render Items
 * @param {ProjectData} row - data
 * @returns {React.ReactElement} div
 */
const _renderItems = (row: ProjectData): React.ReactElement => {
  const names = row.items.map((it) => {
    const found = MOCK_ITEMS.find((m) => m.id === it.itemId);

    return found ? found.name + " x" + it.qty : it.itemId + " x" + it.qty;
  });

  return (
    <div className="flex flex-col">
      <span className="text-xs font-bold text-brand-blue">{row.items.length} item(s)</span>
      <span className="text-xs text-brand-text-medium truncate max-w-[220px]">{names.join(", ")}</span>
    </div>
  );
};

/**
 * Render Status
 * @param {ProjectData} row - data
 * @returns {React.ReactElement} span
 */
const _renderStatus = (row: ProjectData): React.ReactElement => (
  <span className={"px-3 py-1 rounded-full text-xs font-bold uppercase " + (row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>
    {row.status}
  </span>
);

/**
 * Get Basic Columns
 * @param {number} currentPage - current page
 * @param {number} pageSize - page size
 * @returns {TableColumn<ProjectData>[]} columns
 */
const _getBasicColumns = (currentPage: number, pageSize: number): TableColumn<ProjectData>[] => {
  /**
   * Render No wrapper
   * @param {ProjectData} _row - data
   * @param {number} index - index
   * @returns {React.ReactElement} cell
   */
  const renderNoWrapper = (_row: ProjectData, index: number): React.ReactElement => _renderNo(_row, index, currentPage, pageSize);

  return [
    {
      key: "no",
      header: "No",
      align: "center",
      render: renderNoWrapper,
    },
    { key: "name", header: "Project Name" },
    {
      key: "items",
      header: "Items",
      render: _renderItems,
    },
    { key: "remark", header: "Remark" },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: _renderStatus,
    },
    { key: "createBy", header: "Created By" },
  ];
};

/**
 * Get Columns
 * @param {GetColumnsParams} params - params
 * @returns {TableColumn<ProjectData>[]} columns
 */
export const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<ProjectData>[] => {
  /**
   * Render actions
   * @param {ProjectData} row - row
   * @returns {React.ReactElement} action
   */
  const renderActions = (row: ProjectData): React.ReactElement => {
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
      <button
        onClick={handleClick}
        className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer"
        title="Edit"
      >
        <FiEdit2 className="w-4 h-4" />
      </button>
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
