import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "../../components/Table";

import type { GetColumnsParams, VoucherData } from "./MasterVoucher.type";

/**
 * Render No
 * @param {_} _ - user data
 * @param {number} index - index
 * @param {number} currentPage - current page
 * @param {number} pageSize - page size
 * @returns {React.ReactElement} span
 */
const _renderNo = (_: VoucherData, index: number, currentPage: number, pageSize: number): React.ReactElement => (
  <span className="text-sm text-brand-text-medium">{(currentPage - 1) * pageSize + index + 1}</span>
);

/**
 * Render Status
 * @param {VoucherData} row - user data
 * @returns {React.ReactElement} span
 */
const _renderStatus = (row: VoucherData): React.ReactElement => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
    {row.status}
  </span>
);

/**
 * Render Date
 * @param {VoucherData} row - user data
 * @returns {string} string
 */
const _renderDate = (row: VoucherData): string => row.createAt;

/**
 * Get Basic Columns
 * @param {number} currentPage - current page
 * @param {number} pageSize - page size
 * @returns {TableColumn<VoucherData>[]} columns
 */
const _getBasicColumns = (currentPage: number, pageSize: number): TableColumn<VoucherData>[] => {
  /**
   * Render No wrapper
   * @param {VoucherData} _ - data
   * @param {number} index - index
   * @returns {React.ReactElement} cell
   */
  const renderNoWrapper = (_: VoucherData, index: number): React.ReactElement => _renderNo(_, index, currentPage, pageSize);

  /**
   * Render Discount
   * @param {VoucherData} row - data
   * @returns {string} string
   */
  const renderDiscount = (row: VoucherData): string => `${row.discountPercent}%`;

  return [
    {
      key: "no",
      header: "No",
      align: "center",
      render: renderNoWrapper,
    },
    { key: "code", header: "Voucher Code" },
    { key: "discountPercent", header: "Discount (%)", align: "center", render: renderDiscount },
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
 * @returns {TableColumn<VoucherData>[]} columns
 */
export const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<VoucherData>[] => {
  /**
   * Render actions
   * @param {VoucherData} row - row
   * @returns {React.ReactElement} action
   */
  const renderActions = (row: VoucherData): React.ReactElement => {
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
