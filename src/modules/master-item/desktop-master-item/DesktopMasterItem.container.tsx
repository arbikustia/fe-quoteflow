import * as React from "react";

import { DesktopMasterItemComponent, ItemActionButtons } from "./DesktopMasterItem.component";
import { useDesktopMasterItemState } from "./DesktopMasterItem.hook";
import type { GetColumnsParams, ItemData } from "./DesktopMasterItem.type";
import type { TableColumn } from "../../../components/Table";
import { MOCK_ITEMS } from "../../../fixture/master-item";
import { usePagination } from "../../../hooks/usePagination";

/**
 * Get table columns
 * @param {GetColumnsParams} params - params
 * @returns {TableColumn<ItemData>[]} - table columns
 */
const getColumns = ({
  currentPage,
  pageSize,
  onEdit,
  onConfirm,
}: GetColumnsParams): TableColumn<ItemData>[] => [
  {
    key: "no",
    header: "No",
    align: "center",
    /**
     * Render no column
     * @param {ItemData} _ - unused
     * @param {number} index - index
     * @returns {React.ReactElement} - column node
     */
    render: (_, index) => (
      <span className="text-brand-text-medium font-medium text-sm">
        {(currentPage - 1) * pageSize + index + 1}
      </span>
    ),
  },
  { key: "name", header: "Item Name" },
  { key: "category", header: "Category" },
  { key: "unit", header: "Unit" },
  {
    key: "price",
    header: "Price",
    /**
     * Render price column
     * @param {ItemData} row - row
     * @returns {string} - price
     */
    render: (row) => `Rp ${row.price.toLocaleString("id-ID")}`,
  },
  { key: "remark", header: "Remark" },
  {
    key: "actions",
    header: "Action",
    align: "center",
    /**
     * Render actions column
     * @param {ItemData} row - current row
     * @returns {React.ReactElement} - actions node
     */
    render: (row): React.ReactElement => (
      <ItemActionButtons row={row} onEdit={onEdit} onConfirm={onConfirm} />
    ),
  },
];

/**
 * Render Master Item Container
 * @returns {React.ReactElement} - Master Item Container
 */
const DesktopMasterItemContainer = (): React.ReactElement => {
  const state = useDesktopMasterItemState();
  const pagination = usePagination(MOCK_ITEMS);

  /**
   * Handle form submit
   * @param {React.SyntheticEvent<HTMLFormElement>} e - event
   * @returns {void} - void
   */
  const handleFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault();
    state.closeModal();
  };

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: state.openEditModal,
    onConfirm: state.openConfirmModal,
  });

  return (
    <DesktopMasterItemComponent
      {...state}
      {...pagination}
      columns={columns}
      onSubmit={handleFormSubmit}
    />
  );
};

export default DesktopMasterItemContainer;
