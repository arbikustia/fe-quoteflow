import * as React from "react";

import type { TableColumn } from "../../components/Table";
import { MOCK_CATEGORIES } from "../../fixture/master-category";
import { usePagination } from "../../hooks/usePagination";

import { CategoryActionButtons, MasterCategoryComponent } from "./MasterCategory.component";
import { useMasterCategoryState } from "./MasterCategory.hook";
import type { CategoryData, GetColumnsParams } from "./MasterCategory.type";

/**
 * Get table columns
 * @param {GetColumnsParams} params - params
 * @returns {TableColumn<CategoryData>[]} table columns
 */
const getColumns = ({
  currentPage,
  pageSize,
  onEdit,
  onConfirm,
}: GetColumnsParams): TableColumn<CategoryData>[] => [
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
  { key: "categoryName", header: "Category Name" },
  {
    key: "actions",
    header: "Action",
    align: "center",
    /**
     * Render actions column
     * @param {CategoryData} row - current row
     * @returns {React.ReactElement} actions node
     */
    render: (row): React.ReactElement => (
      <CategoryActionButtons row={row} onEdit={onEdit} onConfirm={onConfirm} />
    ),
  },
];

/**
 * Render Master Category Container
 * @returns {React.ReactElement} - Master Category Container
 */
const MasterCategoryContainer = (): React.ReactElement => {
  const state = useMasterCategoryState();
  const pagination = usePagination(MOCK_CATEGORIES);

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
    <MasterCategoryComponent
      {...state}
      {...pagination}
      columns={columns}
      onSubmit={handleFormSubmit}
    />
  );
};

export default MasterCategoryContainer;
