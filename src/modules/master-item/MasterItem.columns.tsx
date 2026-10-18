import type { MouseEvent, ReactElement } from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "../../components/Table";

import type { ActionButtonProps, GetColumnsParams, ItemData } from "./MasterItem.type";

/**
 * Render status badge.
 * @param {ItemData} row - Row item data
 * @returns {ReactElement} Status element
 */
const _renderStatus = (row: ItemData): ReactElement => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
      row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
    }`}
  >
    {row.status}
  </span>
);

/**
 * Render action edit button.
 * @param {ActionButtonProps} props - Action button props
 * @returns {ReactElement} Edit button element
 */
const _renderActionButton = (props: ActionButtonProps): ReactElement => {
  const { row, onEdit } = props;

  /**
   * Handle click button.
   * @param {MouseEvent<HTMLButtonElement>} event - Click event
   */
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onEdit(row);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-lg p-1.5 text-brand-text-medium hover:bg-brand-blue-light hover:text-brand-blue"
      title="Edit"
    >
      <FiEdit2 className="h-4 w-4" />
    </button>
  );
};

/**
 * Render index column number.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} index - Row index
 * @returns {ReactElement} Number element
 */
const _renderIndex = (currentPage: number, pageSize: number, index: number): ReactElement => (
  <span className="text-sm">{(currentPage - 1) * pageSize + index + 1}</span>
);

/**
 * Render image thumbnail or dash.
 * @param {ItemData} row - Row item
 * @returns {ReactElement} Thumbnail element
 */
const _renderImage = (row: ItemData): ReactElement => {
  if (!row.image) {
    return <span>-</span>;
  }

  const fileName = row.image.split("/").pop() ?? row.image;

  return (
    <a href={row.image} target="_blank" rel="noreferrer" className="text-sm text-brand-blue underline hover:text-brand-blue/80">
      {fileName}
    </a>
  );
};

/**
 * Render formatted price.
 * @param {ItemData} row - Row item
 * @returns {string} Formatted price
 */
const _renderPrice = (row: ItemData): string => `Rp ${row.price.toLocaleString("id-ID")}`;

/**
 * Build column configurations for Master Item table.
 * @param {GetColumnsParams} params - Column parameters
 * @returns {TableColumn<ItemData>[]} Column definitions
 */
export const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<ItemData>[] => [
  {
    key: "no",
    header: "No",
    align: "center",
    /**
     * Render row index.
     * @param {ItemData} _row - Row item
     * @param {number} index - Index
     * @returns {ReactElement} Node
     */
    render: (_row: ItemData, index: number): ReactElement => _renderIndex(currentPage, pageSize, index),
  },
  {
    key: "image",
    header: "Image",
    align: "center",
    render: _renderImage,
  },
  { key: "name", header: "Item Name", mobile: { primary: true } },
  { key: "categoryName", header: "Category" },
  {
    key: "price",
    header: "Price",
    render: _renderPrice,
  },
  { key: "stock", header: "Stock", align: "center" },
  { key: "duration", header: "Duration", align: "center" },
  { key: "status", header: "Status", align: "center", render: _renderStatus },
  { key: "remark", header: "Remark" },
  {
    key: "actions",
    header: "Action",
    align: "center",
    /**
     * Render action button.
     * @param {ItemData} row - Row item
     * @returns {ReactElement} Action element
     */
    render: (row: ItemData): ReactElement => _renderActionButton({ row, onEdit }),
  },
];
