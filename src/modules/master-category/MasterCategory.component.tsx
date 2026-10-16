import * as React from "react";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table from "../../components/Table";

import type { CategoryData, MasterCategoryProps } from "./MasterCategory.type";

/**
 * Render category list state.
 * @param {MasterCategoryProps} props - Component props
 * @returns {React.ReactElement | null} State element
 */
const _renderListState = (props: MasterCategoryProps): React.ReactElement | null => {
  if (props.isLoading) return <p className="py-10 text-center text-sm text-brand-text-medium">Loading categories…</p>;
  if (props.isMissingData) return <p className="py-10 text-center text-sm text-red-600">Category data is unavailable. Please try again.</p>;
  if (props.errorMessage) return <p className="py-10 text-center text-sm text-red-600">{props.errorMessage}</p>;
  if (props.isEmpty) return <p className="py-10 text-center text-sm text-brand-text-medium">No categories found.</p>;

  return null;
};

/**
 * Render desktop category table.
 * @param {MasterCategoryProps} props - Component props
 * @returns {React.ReactElement} Desktop table
 */
const _renderDesktopTable = (props: MasterCategoryProps): React.ReactElement => {
  const { paginatedData, columns, currentPage, totalPages, goToPage, pageSize, changePageSize, onRowClick, onCreate, setSearchTerm, totalCount } = props;
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="hidden lg:flex rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs md:flex-1 md:flex-col md:overflow-hidden md:mt-6">
      <div className="flex items-center justify-between gap-4 border-brand-gray-light py-6">
        <SearchFilter placeholder="Search category" onChange={handleSearchChange} />
        <button type="button" onClick={onCreate} className="rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-brand-white shadow-sm transition-colors hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-brand-blue/30">Create Category</button>
      </div>
      <div className="flex-1 overflow-auto">
        {_renderListState(props) ?? <Table data={paginatedData} columns={columns} onRowClick={onRowClick} keyExtractor={(row: CategoryData) => row.id} />}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} onPageChange={goToPage} onPageSizeChange={changePageSize} totalItems={totalCount} />
    </div>
  );
};

/**
 * Master Category component.
 * @param {MasterCategoryProps} props - Component props
 * @returns {React.ReactElement} Category page
 */
export const MasterCategoryComponent = (props: MasterCategoryProps): React.ReactElement => {
  const { paginatedData, columns, currentPage, totalPages, goToPage, pageSize, changePageSize, onRowClick, onCreate, setSearchTerm, totalCount, onBack } = props;
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <Layout pageTitle="Category List">
      <PageLayout title="Category List" breadcrumbs={["Master", "Master Category"]} onBack={onBack}>
        <div className="flex h-full flex-col px-3 pb-18 lg:-mt-4 lg:px-0 lg:pb-0">
          <div className="flex items-center justify-between gap-3 pt-2 lg:hidden">
            <div className="flex-1"><SearchFilter placeholder="Search category" onChange={handleSearchChange} /></div>
            <button type="button" onClick={onCreate} className="shrink-0 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-brand-white">Create Category</button>
          </div>
          <div className="mt-3 lg:hidden">
            {_renderListState(props) ?? <Table data={paginatedData} columns={columns} onRowClick={onRowClick} keyExtractor={(row: CategoryData) => row.id} />}
            <Pagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} onPageChange={goToPage} onPageSizeChange={changePageSize} totalItems={totalCount} className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" />
          </div>
          {_renderDesktopTable(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
