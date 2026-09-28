import * as React from "react";

import type { TableColumn } from "../../components/Table";
import { MOCK_ITEMS } from "../../fixture/master-item";
import { usePagination } from "../../hooks/usePagination";

import { ItemActionButtons, MasterItemComponent } from "./MasterItem.component";
import { useMasterItemState } from "./MasterItem.hook";
import type { GetColumnsParams, ItemData } from "./MasterItem.type";

/**
 * Get table columns
 * @param {GetColumnsParams} params - params
 * @returns {TableColumn<ItemData>[]} table columns
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
     * @param {unknown} _ - unused
     * @param {number} index - index
     * @returns {React.ReactElement} column node
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
     * @returns {string} price
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
     * @returns {React.ReactElement} actions node
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
const MasterItemContainer = (): React.ReactElement => {
  const state = useMasterItemState();
  const pagination = usePagination(MOCK_ITEMS);

  /**
   * Handle form submit
   * @param {React.SyntheticEvent<HTMLFormElement>} e - event
   * @returns {void} void
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
    <MasterItemComponent
      {...state}
      {...pagination}
      columns={columns}
      onSubmit={handleFormSubmit}
    />
  );
};

export default MasterItemContainer;
