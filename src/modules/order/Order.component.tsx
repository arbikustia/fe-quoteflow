import * as React from "react";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table from "../../components/Table";

import type { OrderProps, QuoteData } from "./Order.type";

/**
 * Render loading, error, and empty states.
 * @param {OrderProps} props - Order component props
 * @returns {React.ReactElement | null} Active list state
 */
const _renderListState = (props: OrderProps): React.ReactElement | null => {
  if (props.isLoading) return <p className="py-10 text-center text-sm text-text-secondary">Loading orders…</p>;

  if (props.errorMessage) return <p className="py-10 text-center text-sm text-danger">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-sm text-text-secondary">No orders found.</p>;

  return null;
};

/**
 * Render desktop order table.
 * @param {OrderProps} props - Order component props
 * @returns {React.ReactElement} Desktop list
 */
const _renderDesktopTable = (props: OrderProps): React.ReactElement => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="hidden rounded-4xl border border-border-default bg-background-surface px-6 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 border-brand-gray-light py-6">
        <SearchFilter placeholder="Search order" onChange={handleSearchChange} />
        <button
          type="button"
          onClick={props.openCreateModal}
          className="h-14 rounded-xl bg-brand-blue px-6 text-sm font-semibold text-brand-white shadow-sm transition-colors hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        >
          Create Order
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {_renderListState(props) ?? (
          <Table
            data={props.paginatedData}
            columns={props.columns}
            isDetail={true}
            onRowClick={props.onRowClick}
            keyExtractor={(row: QuoteData): string => row.id}
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
      />
    </div>
  );
};

/**
 * Render mobile order list.
 * @param {OrderProps} props - Order component props
 * @returns {React.ReactElement} Mobile list
 */
const _renderMobileList = (props: OrderProps): React.ReactElement => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter placeholder="Search order" onChange={handleSearchChange} isRoundedFull={true} className="w-full sm:w-full" />
      <div className="min-w-0">
        {_renderListState(props) ?? (
          <Table
            data={props.paginatedData}
            columns={props.columns}
            isDetail={true}
            onRowClick={props.onRowClick}
            keyExtractor={(row: QuoteData): string => row.id}
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
        isCompact={true}
        className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs"
      />
    </div>
  );
};

/**
 * Render order list page.
 * @param {OrderProps} props - Order component props
 * @returns {React.ReactElement} Order page
 */
export const OrderComponent = (props: OrderProps): React.ReactElement => {
  const createButton = (
    <button
      type="button"
      onClick={props.openCreateModal}
      className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-sm font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30"
    >
      Create New
    </button>
  );

  return (
    <Layout pageTitle="Order List" mobileWhiteBackground={true}>
      <PageLayout
        title="Order List"
        breadcrumbs={["Order", "Order List"]}
        headerRight={createButton}
        mobileHeaderClassName="px-0"
        onBack={props.onBack}
      >
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobileList(props)}
          {_renderDesktopTable(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
