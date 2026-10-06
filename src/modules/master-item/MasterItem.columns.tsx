import * as React from "react";

import type { TableColumn } from "../../components/Table";

import { ItemActionButtons } from "./MasterItem.component";
import type { GetColumnsParams, ItemData } from "./MasterItem.type";

/**
 * Render image column
 * @param {ItemData} row - item row
 * @returns {React.ReactElement} Image cell
 */
const _renderImage = (row: ItemData): React.ReactElement => {
  /**
   * Handle image error
   * @param {React.SyntheticEvent<HTMLImageElement, Event>} e - error event
   * @returns {void} void
   */
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    (e.target as HTMLImageElement).style.display = "none";
  };

  return (
    <img
      src={row.image}
      alt={row.name}
      className="w-10 h-10 rounded-lg object-cover mx-auto border border-brand-gray-light"
      onError={handleImageError}
    />
  );
};

/**
 * Render status column
 * @param {ItemData} row - item row
 * @returns {React.ReactElement} Status cell
 */
const _renderStatus = (row: ItemData): React.ReactElement => (
  <span
    className={
      "px-3 py-1 rounded-full text-xs font-bold uppercase " +
      (row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")
    }
  >
    {row.status}
  </span>
);

/**
 * Get basic columns
 * @param {number} currentPage - current page
 * @param {number} pageSize - page size
 * @returns {TableColumn<ItemData>[]} columns
 */
const _getBasicColumns = (currentPage: number, pageSize: number): TableColumn<ItemData>[] => [
  {
    key: "no",
    header: "No",
    align: "center",
    /**
     * Render No
     * @param {ItemData} _row - item row
     * @param {number} index - item index
     * @returns {React.ReactElement} No cell
     */
    render: (_row: ItemData, index: number): React.ReactElement => (
      <span className="text-brand-text-medium font-medium text-sm">
        {(currentPage - 1) * pageSize + index + 1}
      </span>
    ),
  },
  { key: "image", header: "Image", align: "center", render: _renderImage },
  { key: "name", header: "Item Name" },
  { key: "category", header: "Category" },
];

/**
 * Get info columns
 * @returns {TableColumn<ItemData>[]} columns
 */
const _getInfoColumns = (): TableColumn<ItemData>[] => [
  {
    key: "price",
    header: "Price",
    /**
     * Render Price
     * @param {ItemData} row - item row
     * @returns {string} Price cell
     */
    render: (row: ItemData): string => "Rp " + row.price.toLocaleString("id-ID"),
  },
  { key: "stock", header: "Stock", align: "center" },
  { key: "duration", header: "Duration", align: "center" },
  { key: "status", header: "Status", align: "center", render: _renderStatus },
  { key: "remark", header: "Remark" },
];

/**
 * Generates table columns configuration for Master Item
 * @param {GetColumnsParams} params - GetColumnsParams
 * @returns {TableColumn<ItemData>[]} - list of table columns
 */
export const getColumns = ({
  currentPage,
  pageSize,
  onEdit,
  onConfirm,
}: GetColumnsParams): TableColumn<ItemData>[] => [
  ..._getBasicColumns(currentPage, pageSize),
  ..._getInfoColumns(),
  {
    key: "actions",
    header: "Action",
    align: "center",
    /**
     * Render Action
     * @param {ItemData} row - item row
     * @returns {React.ReactElement} Action cell
     */
    render: (row: ItemData): React.ReactElement => (
      <ItemActionButtons row={row} onEdit={onEdit} onConfirm={onConfirm} />
    ),
  },
];
