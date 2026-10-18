import type { ChangeEvent, ReactElement } from "react";
import * as React from "react";

import type { CategoryData, MasterCategoryProps } from "./MasterCategory.type";
import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { MasterDataCard } from "../../components/MasterDataCard";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table from "../../components/Table";

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
    <MasterDataCard title={category.categoryName} status={category.status} onClick={(): void => onEdit(category)}>
      <span className="text-xs text-text-secondary">
        Created {category.createAt ? new Date(category.createAt).toLocaleDateString("id-ID") : "-"}
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
    <SearchFilter placeholder="Search category" onChange={_handleSearch.bind(null, props.setSearchTerm)} isRoundedFull={true} className="w-full sm:w-full" />
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
      {_renderListState(props) ?? <Table data={props.paginatedData} columns={props.columns} isDetail={false} onRowClick={props.onRowClick} keyExtractor={(row: CategoryData): string => row.id} />}
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
  const createButton = (
    <button type="button" onClick={props.onCreate} className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-sm font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30">
      Create New
    </button>
  );

  return (
    <Layout pageTitle="Category List" mobileWhiteBackground={true}>
      <PageLayout title="Category List" breadcrumbs={["Master", "Master Category"]} headerRight={createButton} mobileHeaderClassName="px-0" onBack={props.onBack}>
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props)}
          {_renderDesktop(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
