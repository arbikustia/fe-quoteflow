import type { ChangeEvent, ReactElement } from "react";
import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import { getCategoryRowNumber } from "./MasterCategory.helpers";
import type { CategoryData, MasterCategoryProps } from "./MasterCategory.type";
import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { MasterDataCard } from "../../components/MasterDataCard";
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
  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${category.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
    {category.status}
  </span>
);

/**
 * Build category table columns.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {(category: CategoryData) => void} onEdit - Edit handler
 * @returns {TableColumn<CategoryData>[]} Category columns
 */
const _getColumns = (currentPage: number, pageSize: number, onEdit: (category: CategoryData) => void): TableColumn<CategoryData>[] => {
  const renderNumber = (_category: CategoryData, index: number): ReactElement => <span className="text-sm">{getCategoryRowNumber(currentPage, pageSize, index)}</span>;
  const renderAction = (category: CategoryData): ReactElement => {
    const handleEdit = (event: React.MouseEvent): void => {
      event.stopPropagation();
      onEdit(category);
    };

    return <button type="button" onClick={handleEdit} className="cursor-pointer rounded-lg p-1.5 text-brand-text-medium transition-colors hover:bg-brand-blue-light hover:text-brand-blue" title="Edit"><FiEdit2 className="h-4 w-4" /></button>;
  };

  return [
    { key: "no", header: "No", align: "center", render: renderNumber },
    { key: "categoryName", header: "Category Name" },
    { key: "status", header: "Status", align: "center", render: _renderStatus },
    { key: "createAt", header: "Created At" },
    { key: "actions", header: "Action", align: "center", render: renderAction },
  ];
};

/**
 * Render category list state.
 * @param {MasterCategoryProps} props - Category list props
 * @returns {ReactElement | null} List state or null
 */
const _renderListState = (props: MasterCategoryProps): ReactElement | null => {
  if (props.isLoading) {
    return <p className="py-10 text-center text-sm text-text-tertiary">Loading categories…</p>;
  }

  if (props.isMissingData) {
    return <p className="py-10 text-center text-sm text-danger-strong">Category data is unavailable. Please try again.</p>;
  }

  if (props.errorMessage) {
    return <p className="py-10 text-center text-sm text-danger-strong">{props.errorMessage}</p>;
  }

  if (props.isEmpty) {
    return <p className="py-10 text-center text-sm text-text-tertiary">No categories found.</p>;
  }

  return null;
};

/**
 * Render category card.
 * @param {CategoryData} category - Category data
 * @param {MasterCategoryProps["onEdit"]} onEdit - Edit callback
 * @returns {ReactElement} Category card
 */
const _renderCategoryCard = (category: CategoryData, onEdit: MasterCategoryProps["onEdit"]): ReactElement => {
  return (
    <MasterDataCard title={category.categoryName} status={category.status} isLargeText={true} onClick={(): void => onEdit(category)}>
      <span className="text-xl text-text-secondary">
        Created {category.createAt ? new Date(category.createAt).toLocaleDateString("id-ID").replaceAll("/", "-") : "-"}
      </span>
    </MasterDataCard>
  );
};

/**
 * Handle category search.
 * @param {MasterCategoryProps["setSearchTerm"]} setSearchTerm - Search setter
 * @param {ChangeEvent<HTMLInputElement>} event - Search event
 * @returns {void} No return value
 */
const _handleSearch = (setSearchTerm: MasterCategoryProps["setSearchTerm"], event: ChangeEvent<HTMLInputElement>): void => {
  setSearchTerm(event.target.value);
};

/**
 * Render mobile category list.
 * @param {MasterCategoryProps} props - Category list props
 * @returns {ReactElement} Mobile category list
 */
const _renderMobile = (props: MasterCategoryProps): ReactElement => (
  <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
  <SearchFilter placeholder="Search category" onChange={_handleSearch.bind(null, props.setSearchTerm)} isRoundedFull={true} className="w-full sm:w-full" inputClassName="text-lg placeholder:text-lg" />
    <div className="min-w-0 space-y-3">
      {_renderListState(props) ?? props.paginatedData.map((category) => (
        <React.Fragment key={category.id}>{_renderCategoryCard(category, props.onEdit)}</React.Fragment>
      ))}
    </div>
    <Pagination
      currentPage={props.currentPage}
      totalPages={props.totalPages}
      pageSize={props.pageSize}
      onPageChange={props.goToPage}
      onPageSizeChange={props.changePageSize}
      totalItems={props.totalCount}
      isCompact={true}
      className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs"
    />
  </div>
);

/**
 * Render desktop category list.
 * @param {MasterCategoryProps} props - Category list props
 * @returns {ReactElement} Desktop category list
 */
const _renderDesktop = (props: MasterCategoryProps): ReactElement => (
  <div className="hidden rounded-4xl border border-border-default bg-background-surface px-6 shadow-xs lg:flex md:mt-6 md:flex-1 md:flex-col md:overflow-hidden">
    <div className="flex items-center justify-between gap-4 py-6">
      <SearchFilter placeholder="Search category" onChange={_handleSearch.bind(null, props.setSearchTerm)} />
      <button type="button" onClick={props.onCreate} className="h-14 rounded-xl bg-brand-blue px-6 text-sm font-semibold text-brand-white transition-colors hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-brand-blue/30">
        Create Category
      </button>
    </div>
    <div className="flex-1 overflow-auto">
      {_renderListState(props) ?? <Table data={props.paginatedData} columns={_getColumns(props.currentPage, props.pageSize, props.onEdit)} keyExtractor={(row: CategoryData): string => row.id} />}
    </div>
    <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} />
  </div>
);

/**
 * Render master category list.
 * @param {MasterCategoryProps} props - Category list props
 * @returns {ReactElement} Category list
 */
export const MasterCategoryComponent = (props: MasterCategoryProps): ReactElement => {
  return (
    <Layout pageTitle="Category List" mobileWhiteBackground={true}>
      <PageLayout title="Category List" breadcrumbs={["Master", "Master Category"]} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}>
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props)}
          {_renderDesktop(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
