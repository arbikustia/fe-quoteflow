import type { ChangeEvent, ReactElement } from "react";
import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import { getCategoryRowNumber } from "./MasterCategory.helpers";
import type { CategoryData, MasterCategoryProps } from "./MasterCategory.type";
import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import type { TableColumn } from "../../components/Table";
import Table from "../../components/Table";

/**
 * Render category status table cell.
 * @param {CategoryData} category - Category data
 * @returns {ReactElement} Status cell
 */
const _renderStatus = (category: CategoryData): ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${category.status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
    {category.status}
  </span>
);

/**
 * Render category row number cell.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} index - Row index
 * @returns {ReactElement} Row number
 */
const _renderNumber = (currentPage: number, pageSize: number, index: number): ReactElement => (
  <span className="text-lg">{getCategoryRowNumber(currentPage, pageSize, index)}</span>
);

/**
 * Render category name cell.
 * @param {CategoryData} category - Category data
 * @returns {ReactElement} Category name cell
 */
const _renderCategoryName = (category: CategoryData): ReactElement => (
  <span className="text-lg font-medium">{category.categoryName}</span>
);

/** Format category date using Indonesian long date. */
const _formatCreatedAt = (value: string | null): string => (
  value
    ? new Date(value).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-"
);

/**
 * Render created at cell.
 * @param {CategoryData} category - Category data
 * @returns {ReactElement} Created at cell
 */
const _renderCreatedAt = (category: CategoryData): ReactElement => (
  <span className="text-lg">{_formatCreatedAt(category.createAt)}</span>
);

/**
 * Render category action cell.
 * @param {CategoryData} category - Category data
 * @param {MasterCategoryProps["onEdit"]} onEdit - Edit handler
 * @returns {ReactElement} Action cell
 */
const _renderActions = (category: CategoryData, onEdit: MasterCategoryProps["onEdit"]): ReactElement => {
  /**
   * Handle edit action click.
   * @param {React.MouseEvent} event - Mouse event
   * @returns {void}
   */
  const handleEdit = (event: React.MouseEvent): void => {
    event.stopPropagation();
    onEdit(category);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={handleEdit}
        className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
        title="Edit category"
        aria-label="Edit category"
      >
        <FiEdit2 className="h-5 w-5" />
      </button>
    </div>
  );
};

/**
 * Build category table columns.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {(category: CategoryData) => void} onEdit - Edit handler
 * @returns {TableColumn<CategoryData>[]} Category columns
 */
const _getColumns = (currentPage: number, pageSize: number, onEdit: (category: CategoryData) => void): TableColumn<CategoryData>[] => {
  const renderNumber = (_category: CategoryData, index: number): ReactElement => _renderNumber(currentPage, pageSize, index);
  const renderAction = (category: CategoryData): ReactElement => _renderActions(category, onEdit);

  return [
    { key: "no", header: "No", align: "center", render: renderNumber },
    { key: "categoryName", header: "Category Name", render: _renderCategoryName },
    { key: "status", header: "Status", align: "center", render: _renderStatus },
    { key: "createAt", header: "Created At", render: _renderCreatedAt },
    { key: "actions", header: "Action", align: "center", render: renderAction },
  ];
};

/**
 * Render category list state.
 * @param {MasterCategoryProps} props - Category list props
 * @returns {ReactElement | null} List state or null
 */
const _renderListState = (props: MasterCategoryProps): ReactElement | null => {
  if (props.isMissingData) {
    return <p className="py-10 text-center text-lg text-text-tertiary">Category data is unavailable. Please try again.</p>;
  }

  if (props.errorMessage) {
    return <p className="py-10 text-center text-lg text-text-tertiary">{props.errorMessage}</p>;
  }

  if (props.isEmpty) {
    return <p className="py-10 text-center text-lg text-text-tertiary">No categories found.</p>;
  }

  return null;
};

/**
 * Render action cell skeleton.
 * @returns {ReactElement} Skeleton action cell
 */
const _renderActionSkeleton = (): ReactElement => (
  <div className="flex justify-center gap-1">
    <span className="h-10 w-10 rounded-3xl bg-background-subtle" />
  </div>
);

/**
 * Render single skeleton row.
 * @param {TableColumn<CategoryData>[]} columns - Columns
 * @param {string[]} widths - Widths
 * @param {number} rowIndex - Row index
 * @returns {ReactElement} Skeleton row
 */
const _renderSkeletonRow = (columns: TableColumn<CategoryData>[], widths: string[], rowIndex: number): ReactElement => (
  <tr key={rowIndex} className="animate-pulse">
    {columns.map((column, columnIndex) => (
      <td
        key={column.key}
        className={`border-b border-border-default px-5 py-4 ${column.align === "center" ? "text-center" : "text-left"}`}
      >
        {column.key === "actions" ? (
          _renderActionSkeleton()
        ) : (
          <span className={`inline-block h-5 rounded-3xl bg-background-subtle align-middle ${column.key === "status" ? "w-28 rounded-full" : widths[columnIndex]}`} />
        )}
      </td>
    ))}
  </tr>
);

/**
 * Render category table skeleton.
 * @param {MasterCategoryProps} props - Component props
 * @returns {ReactElement} Table skeleton
 */
const _renderTableSkeleton = (props: MasterCategoryProps): ReactElement => {
  const columns = _getColumns(props.currentPage, props.pageSize, props.onEdit);
  const widths = ["w-6", "w-44", "w-28", "w-32"];

  return (
    <div className="w-full overflow-x-auto" role="status" aria-label="Loading category table">
      <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key}
                className={`bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary ${column.align === "center" ? "text-center" : "text-left"} ${index === 0 ? "rounded-l-3xl" : ""} ${index === columns.length - 1 ? "rounded-r-3xl" : ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }, (_value, rowIndex) => _renderSkeletonRow(columns, widths, rowIndex))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Render mobile card skeleton.
 * @param {number} key - Key
 * @returns {ReactElement} Mobile skeleton
 */
const _renderMobileCardSkeleton = (key: number): ReactElement => (
  <div
    key={key}
    className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small"
    role="status"
    aria-label="Loading category card"
  >
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="h-7 w-40 rounded-3xl bg-background-subtle" />
      <div className="h-8 w-24 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <div className="min-w-0">
        <div className="h-7 w-20 rounded-3xl bg-background-subtle" />
        <div className="mt-1 h-7 w-32 rounded-3xl bg-background-subtle" />
      </div>
    </div>
  </div>
);

/**
 * Render category mobile card.
 * @param {CategoryData} category - Category data
 * @param {MasterCategoryProps["onEdit"]} onEdit - Edit callback
 * @returns {ReactElement} Category card
 */
const _renderCategoryCard = (category: CategoryData, onEdit: MasterCategoryProps["onEdit"]): ReactElement => {
  const badgeClass = category.status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong";
  const formattedDate = _formatCreatedAt(category.createAt);
  const handleClick = (): void => onEdit(category);

  return (
    <button type="button" onClick={handleClick} className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary">
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{category.categoryName}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${badgeClass}`}>{category.status}</span>
      </span>
      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
        <span className="min-w-0"><span className="block text-lg text-text-tertiary">Created</span><span className="mt-1 block text-lg font-medium text-text-primary">{formattedDate}</span></span>
      </span>
    </button>
  );
};

/**
 * Render desktop toolbar with search and create button.
 * @param {(event: ChangeEvent<HTMLInputElement>) => void} handleSearch - Search change handler
 * @param {() => void} onCreate - Create handler
 * @returns {ReactElement} Toolbar element
 */
const _renderDesktopToolbar = (
  handleSearch: (event: ChangeEvent<HTMLInputElement>) => void,
  onCreate: () => void,
): ReactElement => (
  <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
    <SearchFilter
      placeholder="Search category"
      onChange={handleSearch}
      isRoundedFull={true}
      inputClassName="text-lg placeholder:text-lg"
    />
    <button
      type="button"
      onClick={onCreate}
      className="h-14 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
    >
      Create Category
    </button>
  </div>
);

/**
 * Render desktop category list.
 * @param {MasterCategoryProps} props - Category list props
 * @returns {ReactElement} Desktop category list
 */
const _renderDesktop = (props: MasterCategoryProps): ReactElement => {
  /**
   * Handle desktop search change.
   * @param {ChangeEvent<HTMLInputElement>} event - Search change event
   * @returns {void}
   */
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      {_renderDesktopToolbar(handleSearchChange, props.onCreate)}
      <div className="flex-1 overflow-auto">
        {props.isLoading ? _renderTableSkeleton(props) : _renderListState(props) ?? (
          <Table
            data={props.paginatedData}
            columns={_getColumns(props.currentPage, props.pageSize, props.onEdit)}
            isDetail={false}
            onRowClick={props.onEdit}
            keyExtractor={(row: CategoryData): string => row.id}
          />
        )}
      </div>
      <Pagination
        currentPage={props.currentPage}
        totalPages={props.totalPages}
        pageSize={props.pageSize}
        onPageChange={props.goToPage}
        onPageSizeChange={props.changePageSize}
        totalItems={props.totalCount}
        className="pt-4"
      />
    </div>
  );
};

/**
 * Render mobile category list.
 * @param {MasterCategoryProps} props - Category list props
 * @returns {ReactElement} Mobile category list
 */
const _renderMobile = (props: MasterCategoryProps): ReactElement => {
  /**
   * Handle mobile search change.
   * @param {ChangeEvent<HTMLInputElement>} event - Search change event
   * @returns {void}
   */
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter
        placeholder="Search category"
        onChange={handleSearchChange}
        isRoundedFull={true}
        className="w-full sm:w-full"
        inputClassName="!h-16 text-xl placeholder:text-xl"
      />
      <div className="flex min-w-0 flex-col gap-4">
        {props.isLoading ? (
          Array.from({ length: 5 }, (_value, index) => _renderMobileCardSkeleton(index))
        ) : (
          _renderListState(props) ?? props.paginatedData.map((category) => (
            <React.Fragment key={category.id}>{_renderCategoryCard(category, props.onEdit)}</React.Fragment>
          ))
        )}
      </div>
      <Pagination
        currentPage={props.currentPage}
        totalPages={props.totalPages}
        pageSize={props.pageSize}
        onPageChange={props.goToPage}
        onPageSizeChange={props.changePageSize}
        totalItems={props.totalCount}
        isCompact={true}
        className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs"
      />
    </div>
  );
};

/**
 * Render master category list.
 * @param {MasterCategoryProps} props - Category list props
 * @returns {ReactElement} Category list
 */
export const MasterCategoryComponent = (props: MasterCategoryProps): ReactElement => {
  const createButton = (
    <button
      type="button"
      onClick={props.onCreate}
      className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-lg font-bold text-action-primary transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30 lg:hidden"
    >
      Create New
    </button>
  );

  return (
    <Layout pageTitle="Category List">
      <PageLayout
        title="Category List"
        subtitle="Manage product and item categories"
        breadcrumbs={["Master", "Master Category"]}
        headerRight={createButton}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={props.onBack}
      >
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props)}
          {_renderDesktop(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
