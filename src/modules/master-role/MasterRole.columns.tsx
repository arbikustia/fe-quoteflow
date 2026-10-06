import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "../../components/Table";

import type { GetColumnsParams, RoleData } from "./MasterRole.type";

/**
 * Render No
 * @param {_} _ - user data
 * @param {number} index - index
 * @param {number} currentPage - current page
 * @param {number} pageSize - page size
 * @returns {React.ReactElement} span
 */
const _renderNo = (_: RoleData, index: number, currentPage: number, pageSize: number): React.ReactElement => (
  <span className="text-sm text-brand-text-medium">{(currentPage - 1) * pageSize + index + 1}</span>
);

/**
 * Render Status
 * @param {RoleData} row - user data
 * @returns {React.ReactElement} span
 */
const _renderStatus = (row: RoleData): React.ReactElement => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
    {row.status}
  </span>
);

/**
 * Render Date
 * @param {RoleData} row - user data
 * @returns {string} string
 */
const _renderDate = (row: RoleData): string => row.createAt;

/**
 * Get Basic Columns
 * @param {number} currentPage - current page
 * @param {number} pageSize - page size
 * @returns {TableColumn<RoleData>[]} columns
 */
const _getBasicColumns = (currentPage: number, pageSize: number): TableColumn<RoleData>[] => {
  /**
   * Render No wrapper
   * @param {RoleData} _ - user
   * @param {number} index - index
   * @returns {React.ReactElement} cell
   */
  const renderNoWrapper = (_: RoleData, index: number): React.ReactElement => _renderNo(_, index, currentPage, pageSize);

  return [
    {
      key: "no",
      header: "No",
      align: "center",
      render: renderNoWrapper,
    },
    { key: "roleName", header: "Role Name" },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: _renderStatus,
    },
    {
      key: "createAt",
      header: "Created At",
      render: _renderDate,
    },
  ];
};

/**
 * Get Columns
 * @param {GetColumnsParams} params - params
 * @returns {TableColumn<RoleData>[]} columns
 */
export const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<RoleData>[] => {
  /**
   * Render actions
   * @param {RoleData} row - row
   * @returns {React.ReactElement} action
   */
  const renderActions = (row: RoleData): React.ReactElement => {
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
