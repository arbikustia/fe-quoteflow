import type { ChangeEvent, ReactElement } from "react";

import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import Table from "@/components/Table";

import { RETURN_SKELETON_ROW_COUNT } from "./ItemReturn.config";
import { getReturnColumns, ItemReturnMobileCard, renderListState, renderMobileCardSkeleton, renderTableSkeleton } from "./ItemReturn.helper";
import type { ReturnListState } from "./ItemReturn.type";
import { getReturnRowKey } from "./ItemReturn.util";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

/**
 * Render mobile list content.
 * @param {ReturnListState} props - List properties
 * @param {ReactElement | null} state - Error or empty state
 * @returns {ReactElement[] | ReactElement | null} Mobile content
 */
const _renderMobileContent = (props: ReturnListState, state: ReactElement | null): ReactElement[] | ReactElement | null => {
  if (props.isLoading) return Array.from({ length: RETURN_SKELETON_ROW_COUNT }, (_value, index) => renderMobileCardSkeleton(index));

  return state ?? props.rows.map((row) => <ItemReturnMobileCard key={row.id} row={row} onClick={props.onRowClick} />);
};

/**
 * Render desktop list content.
 * @param {ReturnListState} props - List properties
 * @param {ReactElement | null} state - Error or empty state
 * @returns {ReactElement} Desktop content
 */
const _renderDesktopContent = (props: ReturnListState, state: ReactElement | null): ReactElement => {
  const columns = getReturnColumns(props);

  if (props.isLoading) return renderTableSkeleton(columns);

  return state ?? <Table data={props.rows} columns={columns} isDetail={true} onRowClick={props.onRowClick} keyExtractor={getReturnRowKey} />;
};

/**
 * Render list pagination.
 * @param {ReturnListState} props - List properties
 * @param {string} className - Pagination class
 * @param {boolean} [isCompact] - Compact mode
 * @returns {ReactElement} Pagination
 */
const _renderPagination = (props: ReturnListState, className: string, isCompact?: boolean): ReactElement => (
  <Pagination
    currentPage={props.currentPage}
    totalPages={props.totalPages}
    pageSize={props.pageSize}
    onPageChange={props.goToPage}
    onPageSizeChange={props.changePageSize}
    totalItems={props.totalCount}
    isCompact={isCompact}
    className={className}
  />
);

/**
 * Render mobile section.
 * @param {ReturnListState} props - List properties
 * @param {ReactElement | null} state - Error or empty state
 * @param {(event: ChangeEvent<HTMLInputElement>) => void} onSearch - Search handler
 * @returns {ReactElement} Mobile section
 */
const _renderMobile = (props: ReturnListState, state: ReactElement | null, onSearch: (event: ChangeEvent<HTMLInputElement>) => void): ReactElement => (
  <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
    <SearchFilter
      placeholder="Search item return"
      onChange={onSearch}
      isRoundedFull={true}
      className="w-full sm:w-full"
      inputClassName="!h-16 text-xl placeholder:text-xl"
    />
    <div className="flex min-w-0 flex-col gap-4">{_renderMobileContent(props, state)}</div>
    {_renderPagination(props, "w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs", true)}
  </div>
);

/**
 * Render desktop section.
 * @param {ReturnListState} props - List properties
 * @param {ReactElement | null} state - Error or empty state
 * @param {(event: ChangeEvent<HTMLInputElement>) => void} onSearch - Search handler
 * @returns {ReactElement} Desktop section
 */
const _renderDesktop = (props: ReturnListState, state: ReactElement | null, onSearch: (event: ChangeEvent<HTMLInputElement>) => void): ReactElement => (
  <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
    <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
      <SearchFilter placeholder="Search item return" onChange={onSearch} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" />
      <button
        type="button"
        onClick={props.onCreate}
        className="h-14 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover"
      >
        Create Item Return
      </button>
    </div>
    <div className="flex-1 overflow-auto">{_renderDesktopContent(props, state)}</div>
    {_renderPagination(props, "pt-4")}
  </div>
);

/**
 * Render item return list page.
 * @param {ReturnListState} props - List properties
 * @returns {ReactElement} Page element
 */
export const ItemReturnComponent = (props: ReturnListState): ReactElement => {
  const state = renderListState(props);

  /**
   * Forward the search input value.
   * @param {ChangeEvent<HTMLInputElement>} event - Change event
   * @returns {void} Nothing
   */
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <Layout pageTitle="Item Return List">
      <PageLayout
        title="Item Return List"
        subtitle="Manage rental item returns and status"
        breadcrumbs={["Item Return", "Item Return List"]}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={props.onBack}
        headerRight={
          <button
            type="button"
            onClick={props.onCreate}
            className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-4 text-lg font-semibold text-action-primary hover:bg-action-primary-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring lg:hidden"
          >
            Create New
          </button>
        }
      >
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props, state, handleSearchChange)}
          {_renderDesktop(props, state, handleSearchChange)}
        </div>
      </PageLayout>
    </Layout>
  );
};
