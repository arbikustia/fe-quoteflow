import * as React from "react";
import { FiDownload, FiEdit2 } from "react-icons/fi";

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
const _renderDate = (row: VoucherData): string => row.createAt ?? "-";

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
    { key: "name", header: "Name" },
    { key: "code", header: "Voucher Code", mobile: { primary: true } },
    { key: "discountPercent", header: "Discount (%)", align: "center", render: renderDiscount, mobile: { primary: true } },
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
 * Create voucher download handler.
 * @param {VoucherData} row - Voucher row
 * @param {((voucher: VoucherData) => void) | undefined} onDownload - Download handler
 * @returns {(event: React.MouseEvent) => void} Click handler
 */
const _createDownloadHandler = (row: VoucherData, onDownload?: (voucher: VoucherData) => void): ((event: React.MouseEvent) => void) => (event: React.MouseEvent): void => {
  event.stopPropagation();
  onDownload?.(row);
};

/**
 * Create voucher edit handler.
 * @param {VoucherData} row - Voucher row
 * @param {(voucher: VoucherData) => void} onEdit - Edit handler
 * @returns {(event: React.MouseEvent) => void} Click handler
 */
const _createEditHandler = (row: VoucherData, onEdit: (voucher: VoucherData) => void): ((event: React.MouseEvent) => void) => (event: React.MouseEvent): void => {
  event.stopPropagation();
  onEdit(row);
};

/**
 * Render voucher row action buttons.
 * @param {VoucherData} row - Voucher row
 * @param {(voucher: VoucherData) => void} onEdit - Edit handler
 * @param {((voucher: VoucherData) => void) | undefined} onDownload - Download handler
 * @returns {React.ReactElement} Action buttons element
 */
const _renderVoucherActions = (row: VoucherData, onEdit: (voucher: VoucherData) => void, onDownload?: (voucher: VoucherData) => void): React.ReactElement => {
  const handleDownload = _createDownloadHandler(row, onDownload);
  const handleEdit = _createEditHandler(row, onEdit);

  return (
    <div className="flex items-center justify-center gap-2">
      <button type="button" onClick={handleDownload} className="cursor-pointer rounded-lg p-1.5 text-brand-text-medium transition-colors hover:bg-brand-blue-light hover:text-brand-blue" title="Download voucher" aria-label={`Download voucher ${row.code}`}><FiDownload className="h-4 w-4" /></button>
      <button type="button" onClick={handleEdit} className="cursor-pointer rounded-lg p-1.5 text-brand-text-medium transition-colors hover:bg-brand-blue-light hover:text-brand-blue" title="Edit" aria-label={`Edit voucher ${row.code}`}><FiEdit2 className="h-4 w-4" /></button>
    </div>
  );
};

/**
 * Get Columns
 * @param {GetColumnsParams} params - params
 * @returns {TableColumn<VoucherData>[]} columns
 */
export const getColumns = ({ currentPage, pageSize, onEdit, onDownload }: GetColumnsParams): TableColumn<VoucherData>[] => [
  ..._getBasicColumns(currentPage, pageSize),
  {
    key: "actions",
    header: "Action",
    align: "center",
    /**
     * Render action buttons.
     * @param {VoucherData} row - Voucher row
     * @returns {React.ReactElement} Action buttons
     */
    render: (row: VoucherData): React.ReactElement => _renderVoucherActions(row, onEdit, onDownload),
  },
];
