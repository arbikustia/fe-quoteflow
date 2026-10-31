/* eslint-disable jsdoc/require-jsdoc */
import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table, { type TableColumn } from "../../components/Table";

import type { OrderProps, QuoteData } from "./Order.type";

/**
 * Format order currency.
 * @param {number} value - Amount
 * @returns {string} Formatted currency
 */
const _formatCurrency = (value: number): string => `Rp ${value.toLocaleString("id-ID")}`;

/**
 * Build order table columns.
 * @param {OrderProps} props - Order page props
 * @returns {TableColumn<QuoteData>[]} Order columns
 */
const _getColumns = (props: OrderProps): TableColumn<QuoteData>[] => [
  { key: "no", header: "No", align: "center", render: (_row: QuoteData, index: number): React.ReactElement => <span>{(props.currentPage - 1) * props.pageSize + index + 1}</span> },
  { key: "name", header: "Event Name" },
  { key: "customerPhone", header: "Customer Phone" },
  { key: "location", header: "Address" },
  { key: "startDate", header: "Start Date" },
  { key: "endDate", header: "End Date" },
  { key: "grandTotal", header: "Grand Total", align: "right", render: (row: QuoteData): React.ReactElement => <span>{row.grandTotal.toLocaleString("id-ID")}</span> },
  { key: "actions", header: "Action", align: "center", render: (row: QuoteData): React.ReactElement => _renderEditAction(row, props.openEditModal) },
];

/**
 * Render order edit action.
 * @param {QuoteData} order - Order row
 * @param {(order: QuoteData) => void} onEdit - Edit callback
 * @returns {React.ReactElement} Edit button
 */
const _renderEditAction = (order: QuoteData, onEdit: (order: QuoteData) => void): React.ReactElement => {
  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onEdit(order);
  };

  return <button type="button" onClick={handleEdit} className="cursor-pointer rounded-lg p-1.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary" title="Edit order" aria-label="Edit order"><FiEdit2 className="h-4 w-4" /></button>;
};

/**
 * Render mobile order card.
 * @param {QuoteData} order - Order row
 * @param {(quote: QuoteData) => void} onRowClick - Row click handler
 * @returns {React.ReactElement} Order card
 */
const _renderOrderCard = (order: QuoteData, onRowClick: OrderProps["onRowClick"]): React.ReactElement => {
  /**
   * Open order details.
   * @returns {void} No return value
   */
  const handleClick = (): void => onRowClick(order);

  const status = order.status === 1 ? "active" : "inactive";
  const statusClass = status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong";

  return (
    <button type="button" onClick={handleClick} className="group flex w-full items-start gap-4 rounded-2xl border border-border-default bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
      <span className="min-w-0 flex-1">
        <span className="block truncate text-2xl font-semibold text-text-primary">{order.name || "-"}</span>
        <span className="mt-3 block">
          <span className="grid gap-1 text-xl text-text-secondary">
            <span className="truncate">{order.startDate || "-"}</span>
            <span className="truncate">{order.endDate || "-"}</span>
            <span className="truncate">{order.location || "-"}</span>
            <span className="truncate">{_formatCurrency(order.grandTotal)}</span>
          </span>
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-sm font-bold uppercase tracking-wider ${statusClass}`}>{status}</span>
      </span>
    </button>
  );
};

/**
 * Render mobile order cards.
 * @param {OrderProps} props - Order component props
 * @returns {React.ReactElement} Mobile list
 */
const _renderMobileCards = (props: OrderProps): React.ReactElement => {
  const listState = _renderListState(props);

  if (listState) return listState;

  return <div className="min-w-0 space-y-3">{props.paginatedData.map((order) => <React.Fragment key={order.id}>{_renderOrderCard(order, props.onRowClick)}</React.Fragment>)}</div>;
};

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
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} handleSearchChange - Search handler
 * @returns {React.ReactElement} Desktop list
 */
// eslint-disable-next-line max-lines-per-function
const _renderDesktopTable = (props: OrderProps, handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void): React.ReactElement => {
  const columns = _getColumns(props);

  return (
    <div className="hidden rounded-4xl border border-border-default bg-background-surface px-6 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 border-brand-gray-light py-6">
        <SearchFilter placeholder="Search order" onChange={handleSearchChange} />
        {props.canCreateOrder && (
          <button
            type="button"
            onClick={props.openCreateModal}
            className="h-14 rounded-xl bg-brand-blue px-6 text-sm font-semibold text-brand-white shadow-sm transition-colors hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          >
            Create Order
          </button>
        )}
      </div>
      <div className="flex-1 overflow-auto">
        {_renderListState(props) ?? (
          <Table
            data={props.paginatedData}
            columns={columns}
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
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} handleSearchChange - Search handler
 * @returns {React.ReactElement} Mobile list
 */
const _renderMobileList = (
  props: OrderProps,
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
): React.ReactElement => {
  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter placeholder="Search order" onChange={handleSearchChange} isRoundedFull={true} className="w-full sm:w-full [&_svg]:h-7 [&_svg]:w-7" inputClassName="h-16 pl-14 text-xl placeholder:text-xl lg:h-14" />
      {_renderMobileCards(props)}
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
  /**
   * Handle search input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search input change event
   * @returns {void} No return value
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  const createButton = (
    <button
      type="button"
      onClick={props.openCreateModal}
      className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-lg font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30"
    >
      Create
    </button>
  );

  return (
    <Layout pageTitle="Order List" mobileWhiteBackground={true}>
      <PageLayout
        title="Order List"
        breadcrumbs={["Order", "Order List"]}
        headerRight={props.canCreateOrder ? createButton : undefined}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={props.onBack}
      >
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobileList(props, handleSearchChange)}
          {_renderDesktopTable(props, handleSearchChange)}
        </div>
      </PageLayout>
    </Layout>
  );
};
