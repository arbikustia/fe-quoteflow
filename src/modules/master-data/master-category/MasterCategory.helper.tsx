import type * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "@/components/Table";

import { CATEGORY_STATUS_BADGE_CLASS } from "./MasterCategory.config";
import type { CategoryData, CategoryMobileCardProps } from "./MasterCategory.type";
import { getCategoryRowNumber } from "./MasterCategory.util";

/**
 * Create an edit click handler that does not bubble up to the table row click.
 * @param {CategoryData} category - Category of the row
 * @param {(category: CategoryData) => void} onEdit - Edit callback
 * @returns {(event: React.MouseEvent<HTMLButtonElement>) => void} - Edit button click handler
 */
export const _createEditClickHandler = (
  category: CategoryData,
  onEdit: (category: CategoryData) => void,
): ((event: React.MouseEvent<HTMLButtonElement>) => void) => {
  return (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onEdit(category);
  };
};

/**
 * Render the category name cell.
 * @param {CategoryData} category - Category row
 * @returns {React.ReactElement} - Name cell
 */
const _renderNameCell = (category: CategoryData): React.ReactElement => (
  <span className="text-lg font-medium">{category.categoryName}</span>
);

/**
 * Render the category status cell.
 * @param {CategoryData} category - Category row
 * @returns {React.ReactElement} - Status badge cell
 */
const _renderStatusCell = (category: CategoryData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${CATEGORY_STATUS_BADGE_CLASS[category.status]}`}>
    {category.status}
  </span>
);

/**
 * Render the created-at cell.
 * @param {CategoryData} category - Category row
 * @returns {React.ReactElement} - Created-at cell
 */
const _renderCreatedAtCell = (category: CategoryData): React.ReactElement => (
  <span className="text-lg">{category.createdAt}</span>
);

/**
 * Build the category table columns; the action column is shown only with edit permission.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {boolean} canEdit - Whether the user may edit categories
 * @param {(category: CategoryData) => void} onEdit - Edit callback
 * @returns {TableColumn<CategoryData>[]} - Category table columns
 */
export const getCategoryColumns = (
  currentPage: number,
  pageSize: number,
  canEdit: boolean,
  onEdit: (category: CategoryData) => void,
): TableColumn<CategoryData>[] => {
  /**
   * Render the row number cell.
   * @param {CategoryData} _category - Category row
   * @param {number} rowIndex - Zero-based row index
   * @returns {React.ReactElement} - Row number cell
   */
  const renderNumberCell = (_category: CategoryData, rowIndex: number): React.ReactElement => (
    <span className="text-lg">{getCategoryRowNumber(currentPage, pageSize, rowIndex)}</span>
  );

  /**
   * Render the row action cell.
   * @param {CategoryData} category - Category row
   * @returns {React.ReactElement} - Action cell
   */
  const renderActionCell = (category: CategoryData): React.ReactElement => (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={_createEditClickHandler(category, onEdit)}
        className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
        title="Edit category"
        aria-label="Edit category"
      >
        <FiEdit2 className="h-5 w-5" />
      </button>
    </div>
  );

  const columns: TableColumn<CategoryData>[] = [
    { key: "no", header: "No", align: "center", render: renderNumberCell },
    { key: "categoryName", header: "Category Name", render: _renderNameCell },
    { key: "status", header: "Status", align: "center", render: _renderStatusCell },
    { key: "createAt", header: "Created At", render: _renderCreatedAtCell },
  ];

  if (!canEdit) {
    return columns;
  }

  return [...columns, { key: "actions", header: "Action", align: "center", render: renderActionCell }];
};

/**
 * Get the table row key of a category.
 * @param {CategoryData} category - Category row
 * @returns {string} - Row key
 */
export const getCategoryRowKey = (category: CategoryData): string => category.id;

/**
 * Render a category card for the mobile list; disabled without edit permission.
 * @param {CategoryMobileCardProps} props - Category, edit permission and edit callback
 * @returns {React.ReactElement} - Category card
 */
export const renderCategoryMobileCard = (props: CategoryMobileCardProps): React.ReactElement => {
  const { category, canEdit, onEdit } = props;

  return (
    <button
      key={category.id}
      type="button"
      disabled={!canEdit}
      onClick={_createEditClickHandler(category, onEdit)}
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-default disabled:hover:bg-background-surface"
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{category.categoryName}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${CATEGORY_STATUS_BADGE_CLASS[category.status]}`}>
          {category.status}
        </span>
      </span>
      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
        <span className="min-w-0">
          <span className="block text-lg text-text-tertiary">Created</span>
          <span className="mt-1 block text-lg font-medium text-text-primary">{category.createdAt}</span>
        </span>
      </span>
    </button>
  );
};
