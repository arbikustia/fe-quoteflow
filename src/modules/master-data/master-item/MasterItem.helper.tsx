import type * as React from "react";
import { FiChevronDown, FiDownload, FiEdit2 } from "react-icons/fi";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";

import { CheckboxComponent } from "@/components/Checkbox";
import { MasterDataCard } from "@/components/MasterDataCard";
import type { TableColumn } from "@/components/Table";

import { ITEM_DOWNLOAD_LABEL, ITEM_EMPTY_VALUE, ITEM_STATUS_BADGE_CLASS } from "./MasterItem.config";
import type { ItemColumnParams, ItemData, ItemDownloadFormat, ItemMobileCardProps } from "./MasterItem.type";
import { formatRupiah, getItemRowNumber } from "./MasterItem.util";

const DOWNLOAD_FORMATS: ItemDownloadFormat[] = ["image", "pdf"];

/**
 * Create an edit click handler that does not bubble up to the table row click.
 * @param {ItemData} item - Item of the row
 * @param {(item: ItemData) => void} onEdit - Edit callback
 * @returns {(event: React.MouseEvent<HTMLButtonElement>) => void} - Edit button click handler
 */
export const _createEditClickHandler = (
  item: ItemData,
  onEdit: (item: ItemData) => void,
): ((event: React.MouseEvent<HTMLButtonElement>) => void) => {
  return (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onEdit(item);
  };
};

/**
 * Create a handler bound to one item (selection toggle, card click, download).
 * @param {ItemData} item - Item of the row
 * @param {(item: ItemData) => void} callback - Callback receiving the item
 * @returns {() => void} - Handler that ignores its own arguments
 */
export const _createItemHandler = (item: ItemData, callback: (item: ItemData) => void): (() => void) => {
  return (): void => {
    callback(item);
  };
};

/**
 * Build the download menu of one row.
 * @param {ItemData} item - Item of the row
 * @param {(item: ItemData, format: ItemDownloadFormat) => void} onDownload - Download callback
 * @returns {MenuProps["items"]} - Image and PDF menu entries
 */
export const _createDownloadMenuItems = (
  item: ItemData,
  onDownload: (item: ItemData, format: ItemDownloadFormat) => void,
): MenuProps["items"] => DOWNLOAD_FORMATS.map((format) => ({
  key: format,
  label: ITEM_DOWNLOAD_LABEL[format],
  onClick: _createItemHandler(item, (selected) => onDownload(selected, format)),
}));

/**
 * Render the image link cell.
 * @param {ItemData} item - Item row
 * @returns {React.ReactElement} - Image link, or a placeholder without image
 */
const _renderImageCell = (item: ItemData): React.ReactElement => {
  if (!item.image) {
    return <span className="text-lg">{ITEM_EMPTY_VALUE}</span>;
  }

  return (
    <a href={item.image} target="_blank" rel="noreferrer" className="text-lg font-medium text-action-primary underline hover:text-action-primary-hover">
      See image
    </a>
  );
};

/**
 * Render a plain text cell.
 * @param {string | number} value - Cell value
 * @returns {React.ReactElement} - Text cell
 */
const _renderTextCell = (value: string | number): React.ReactElement => <span className="text-lg">{value}</span>;

/**
 * Render the item name cell.
 * @param {ItemData} item - Item row
 * @returns {React.ReactElement} - Name cell
 */
const _renderNameCell = (item: ItemData): React.ReactElement => _renderTextCell(item.name);

/**
 * Render the category cell.
 * @param {ItemData} item - Item row
 * @returns {React.ReactElement} - Category cell
 */
const _renderCategoryCell = (item: ItemData): React.ReactElement => _renderTextCell(item.categoryName);

/**
 * Render the price cell.
 * @param {ItemData} item - Item row
 * @returns {React.ReactElement} - Price cell
 */
const _renderPriceCell = (item: ItemData): React.ReactElement => _renderTextCell(formatRupiah(item.price));

/**
 * Render the stock cell.
 * @param {ItemData} item - Item row
 * @returns {React.ReactElement} - Stock cell
 */
const _renderStockCell = (item: ItemData): React.ReactElement => _renderTextCell(item.stock);

/**
 * Render the duration cell.
 * @param {ItemData} item - Item row
 * @returns {React.ReactElement} - Duration cell
 */
const _renderDurationCell = (item: ItemData): React.ReactElement => _renderTextCell(item.duration);

/**
 * Render the remark cell.
 * @param {ItemData} item - Item row
 * @returns {React.ReactElement} - Remark cell
 */
const _renderRemarkCell = (item: ItemData): React.ReactElement => _renderTextCell(item.remark);

/**
 * Render the item status cell.
 * @param {ItemData} item - Item row
 * @returns {React.ReactElement} - Status badge cell
 */
const _renderStatusCell = (item: ItemData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${ITEM_STATUS_BADGE_CLASS[item.status]}`}>
    {item.status}
  </span>
);

/**
 * Render the edit and download actions of a row.
 * @param {ItemData} item - Item row
 * @param {ItemColumnParams} params - Edit permission and callbacks
 * @returns {React.ReactElement} - Action cell
 */
const _renderActionCell = (item: ItemData, params: ItemColumnParams): React.ReactElement => (
  <div className="flex items-center justify-center gap-1">
    {params.canEdit && (
      <button
        type="button"
        onClick={_createEditClickHandler(item, params.onEdit)}
        className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
        title="Edit item"
        aria-label={`Edit item ${item.name}`}
      >
        <FiEdit2 className="h-5 w-5" />
      </button>
    )}
    <Dropdown menu={{ items: _createDownloadMenuItems(item, params.onDownload) }} trigger={["click"]}>
      <button
        type="button"
        className="flex cursor-pointer items-center gap-1 rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
        title="Download QR"
        aria-label={`Download QR of ${item.name}`}
      >
        <FiDownload className="h-5 w-5" />
        <FiChevronDown className="h-4 w-4" />
      </button>
    </Dropdown>
  </div>
);

/**
 * Build the selection column; shown only in multi-download mode.
 * @param {ItemColumnParams} params - Selection state and toggle callback
 * @returns {TableColumn<ItemData>[]} - Selection column, or none
 */
const _getSelectColumns = (params: ItemColumnParams): TableColumn<ItemData>[] => {
  const { isMultiDownloadMode, selectedItemIds, onToggleItem } = params;

  if (!isMultiDownloadMode) {
    return [];
  }

  /**
   * Render the selection checkbox of a row.
   * @param {ItemData} item - Item row
   * @returns {React.ReactElement} - Checkbox cell
   */
  const renderSelectCell = (item: ItemData): React.ReactElement => (
    <CheckboxComponent ariaLabel={`Select ${item.name}`} checked={selectedItemIds.includes(item.id)} onChange={_createItemHandler(item, onToggleItem)} />
  );

  return [{ key: "select", header: "", align: "center", render: renderSelectCell }];
};

/**
 * Build the item table columns.
 * @param {ItemColumnParams} params - Paging, permission, selection state and callbacks
 * @returns {TableColumn<ItemData>[]} - Item table columns
 */
export const getItemColumns = (params: ItemColumnParams): TableColumn<ItemData>[] => {
  const { currentPage, pageSize } = params;

  /**
   * Render the row number cell.
   * @param {ItemData} _item - Item row
   * @param {number} rowIndex - Zero-based row index
   * @returns {React.ReactElement} - Row number cell
   */
  const renderNumberCell = (_item: ItemData, rowIndex: number): React.ReactElement => _renderTextCell(getItemRowNumber(currentPage, pageSize, rowIndex));

  /**
   * Render the row action cell.
   * @param {ItemData} item - Item row
   * @returns {React.ReactElement} - Action cell
   */
  const renderActionCell = (item: ItemData): React.ReactElement => _renderActionCell(item, params);

  return [
    ..._getSelectColumns(params),
    { key: "no", header: "No", align: "center", render: renderNumberCell },
    { key: "image", header: "Image", align: "center", render: _renderImageCell },
    { key: "name", header: "Item Name", render: _renderNameCell },
    { key: "categoryName", header: "Category", render: _renderCategoryCell },
    { key: "price", header: "Price", render: _renderPriceCell },
    { key: "stock", header: "Stock", align: "center", render: _renderStockCell },
    { key: "duration", header: "Duration", align: "center", render: _renderDurationCell },
    { key: "status", header: "Status", align: "center", render: _renderStatusCell },
    { key: "remark", header: "Remark", render: _renderRemarkCell },
    { key: "actions", header: "Action", align: "center", render: renderActionCell },
  ];
};

/**
 * Get the table row key of an item.
 * @param {ItemData} item - Item row
 * @returns {string} - Row key
 */
export const getItemRowKey = (item: ItemData): string => item.id;

/**
 * Render an item card for the mobile list; not clickable without edit permission.
 * @param {ItemMobileCardProps} props - Item, edit permission and edit callback
 * @returns {React.ReactElement} - Item card
 */
export const renderItemMobileCard = (props: ItemMobileCardProps): React.ReactElement => {
  const { item, canEdit, onEdit } = props;

  return (
    <MasterDataCard
      key={item.id}
      title={item.name}
      status={item.status}
      isLargeText={true}
      onClick={canEdit ? _createItemHandler(item, onEdit) : undefined}
    >
      <span className="grid gap-2 text-xl text-text-secondary">
        <span>{item.categoryName}</span>
        <span>{`${formatRupiah(item.price)} · ${item.stock} unit · ${item.duration} days`}</span>
      </span>
    </MasterDataCard>
  );
};
