import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "../../components/Table";

import type { GetColumnsParams, UserData } from "./MasterUser.type";

/**
 * Render No
 * @param {_} _ - user data
 * @param {number} index - index
 * @param {number} currentPage - current page
 * @param {number} pageSize - page size
 * @returns {React.ReactElement} span
 */
const _renderNo = (_: UserData, index: number, currentPage: number, pageSize: number): React.ReactElement => (
  <span className="text-sm text-brand-text-medium">{(currentPage - 1) * pageSize + index + 1}</span>
);

/**
 * Render Role
 * @param {UserData} row - user data
 * @returns {React.ReactElement} span
 */
const _renderRole = (row: UserData): React.ReactElement => (
  <span className={`font-bold ${row.role === "Admin" ? "text-brand-blue" : "text-brand-text-medium"}`}>
    {row.role}
  </span>
);

/**
 * Render Status
 * @param {UserData} row - user data
 * @returns {React.ReactElement} span
 */
const _renderStatus = (row: UserData): React.ReactElement => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
    {row.status}
  </span>
);

/**
 * Render Date
 * @param {UserData} row - user data
 * @returns {string} string
 */
const _renderDate = (row: UserData): string => row.createAt;

/**
 * Get Basic Columns
 * @param {number} currentPage - current page
 * @param {number} pageSize - page size
 * @returns {TableColumn<UserData>[]} columns
 */
const _getBasicColumns = (currentPage: number, pageSize: number): TableColumn<UserData>[] => {
  /**
   * Render No wrapper
   * @param {UserData} _ - user
   * @param {number} index - index
   * @returns {React.ReactElement} cell
   */
  const renderNoWrapper = (_: UserData, index: number): React.ReactElement => _renderNo(_, index, currentPage, pageSize);

  return [
    {
      key: "no",
      header: "No",
      align: "center",
      render: renderNoWrapper,
    },
    { key: "username", header: "Username" },
    {
      key: "role",
      header: "Role",
      render: _renderRole,
    },
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
 * @returns {TableColumn<UserData>[]} columns
 */
export const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<UserData>[] => {
  /**
   * Render actions
   * @param {UserData} row - row
   * @returns {React.ReactElement} action
   */
  const renderActions = (row: UserData): React.ReactElement => {
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
