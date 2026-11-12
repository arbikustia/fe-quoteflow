import * as React from "react";

import { AlertComponent } from "@/components/Alert";
import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import { CUSTOMER_LIST_MESSAGE, MASTER_CUSTOMER_CONFIG } from "./MasterCustomer.config";
import { getCustomerColumns, getCustomerRowKey, renderCustomerMobileCard } from "./MasterCustomer.helper";
import type { CustomerData, CustomerListStatus, MasterCustomerProps } from "./MasterCustomer.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

const SKELETON_ROW_INDEXES = Array.from({ length: MASTER_CUSTOMER_CONFIG.SKELETON_ROW_COUNT }, (_value, index) => index);

/**
 * Render the message shown instead of rows, if the list state has one.
 * @param {CustomerListStatus} listStatus - Current list state
 * @returns {React.ReactElement | null} - State message, or null when rows render
 */
const _renderListMessage = (listStatus: CustomerListStatus): React.ReactElement | null => {
  if (listStatus === "loading" || listStatus === "ready") {
    return null;
  }

  return <p className="py-10 text-center text-lg text-text-tertiary">{CUSTOMER_LIST_MESSAGE[listStatus]}</p>;
};

/**
 * Get the text alignment class of a table column.
 * @param {TableColumn<CustomerData>} column - Table column
 * @returns {string} - Alignment class
 */
const _getAlignClass = (column: TableColumn<CustomerData>): string => (column.align === "center" ? "text-center" : "text-left");

/**
 * Render one skeleton cell matching its column.
 * @param {TableColumn<CustomerData>} column - Table column
 * @param {number} columnIndex - Column index
 * @returns {React.ReactElement} - Skeleton cell
 */
const _renderSkeletonCell = (column: TableColumn<CustomerData>, columnIndex: number): React.ReactElement => {
  if (column.key === "actions") {
    return (
      <div className="flex justify-center gap-1">
        <span className="h-10 w-10 rounded-3xl bg-background-subtle" />
      </div>
    );
  }

  const widthClass = column.key === "status" ? "w-28 rounded-full" : MASTER_CUSTOMER_CONFIG.SKELETON_COLUMN_WIDTHS[columnIndex];

  return <span className={`inline-block h-5 rounded-3xl bg-background-subtle align-middle ${widthClass}`} />;
};

/**
 * Render the customer table skeleton with the real column headers.
 * @param {TableColumn<CustomerData>[]} columns - Table columns
 * @returns {React.ReactElement} - Table skeleton
 */
const _renderTableSkeleton = (columns: TableColumn<CustomerData>[]): React.ReactElement => (
  <div className="w-full overflow-x-auto" role="status" aria-label="Loading customer table">
    <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              key={column.key}
              className={`bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary ${_getAlignClass(column)} ${index === 0 ? "rounded-l-3xl" : ""} ${index === columns.length - 1 ? "rounded-r-3xl" : ""}`}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SKELETON_ROW_INDEXES.map((rowIndex) => (
          <tr key={rowIndex} className="animate-pulse">
            {columns.map((column, columnIndex) => (
              <td key={column.key} className={`border-b border-border-default px-5 py-4 ${_getAlignClass(column)}`}>
                {_renderSkeletonCell(column, columnIndex)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * Render one mobile customer card skeleton.
 * @param {number} key - Skeleton key
 * @returns {React.ReactElement} - Card skeleton
 */
const _renderMobileCardSkeleton = (key: number): React.ReactElement => (
  <div
    key={key}
    className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small"
    role="status"
    aria-label="Loading customer card"
  >
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="h-7 w-40 rounded-3xl bg-background-subtle" />
      <div className="h-8 w-24 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <div className="min-w-0">
        <div className="h-7 w-20 rounded-3xl bg-background-subtle" />
        <div className="mt-1 h-7 w-36 rounded-3xl bg-background-subtle" />
      </div>
      <div className="text-right">
        <div className="ml-auto h-7 w-24 rounded-3xl bg-background-subtle" />
        <div className="mt-1 h-7 w-28 rounded-3xl bg-background-subtle" />
      </div>
    </div>
  </div>
);

/**
 * Render the desktop table body for the current list state.
 * @param {MasterCustomerProps} props - Customer list props
 * @param {TableColumn<CustomerData>[]} columns - Table columns
 * @returns {React.ReactElement} - Skeleton, state message or table
 */
const _renderDesktopContent = (props: MasterCustomerProps, columns: TableColumn<CustomerData>[]): React.ReactElement => {
  const { listStatus, customers, onEdit } = props;

  if (listStatus === "loading") {
    return _renderTableSkeleton(columns);
  }

  return (
    _renderListMessage(listStatus) ?? (
      <Table data={customers} columns={columns} isDetail={false} onRowClick={onEdit} keyExtractor={getCustomerRowKey} />
    )
  );
};

/**
 * Render the mobile list body for the current list state.
 * @param {MasterCustomerProps} props - Customer list props
 * @returns {React.ReactNode} - Skeletons, state message or customer cards
 */
const _renderMobileContent = (props: MasterCustomerProps): React.ReactNode => {
  const { listStatus, customers, onEdit } = props;

  if (listStatus === "loading") {
    return SKELETON_ROW_INDEXES.map(_renderMobileCardSkeleton);
  }

  return _renderListMessage(listStatus) ?? customers.map((customer) => renderCustomerMobileCard({ customer, onEdit }));
};

/**
 * Render the desktop card with search, table and pagination.
 * @param {MasterCustomerProps} props - Customer list props
 * @returns {React.ReactElement} - Desktop list
 */
const _renderDesktopList = (props: MasterCustomerProps): React.ReactElement => {
  const { currentPage, pageSize, totalPages, totalCount, onPageChange, onPageSizeChange, onSearchChange, onCreate, onEdit } = props;
  const columns = getCustomerColumns(currentPage, pageSize, onEdit);

  return (
    <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
        <SearchFilter placeholder="Search customer" onChange={onSearchChange} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" />
        <button
          type="button"
          onClick={onCreate}
          className="h-14 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          Create Customer
        </button>
      </div>
      <div className="flex-1 overflow-auto">{_renderDesktopContent(props, columns)}</div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        totalItems={totalCount}
        className="pt-4"
      />
    </div>
  );
};

/**
 * Render the mobile list with search, cards and pagination.
 * @param {MasterCustomerProps} props - Customer list props
 * @returns {React.ReactElement} - Mobile list
 */
const _renderMobileList = (props: MasterCustomerProps): React.ReactElement => {
  const { currentPage, pageSize, totalPages, totalCount, onPageChange, onPageSizeChange, onSearchChange } = props;

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter
        placeholder="Search customer"
        onChange={onSearchChange}
        isRoundedFull={true}
        className="w-full sm:w-full"
        inputClassName="!h-16 text-xl placeholder:text-xl"
      />
      <div className="flex min-w-0 flex-col gap-4">{_renderMobileContent(props)}</div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        totalItems={totalCount}
        isCompact={true}
        className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs"
      />
    </div>
  );
};

/**
 * Render the customer list page.
 * @param {MasterCustomerProps} props - Customer list props
 * @returns {React.ReactElement} - Customer list page
 */
const MasterCustomerComponent = (props: MasterCustomerProps): React.ReactElement => {
  const { successMessage, onBack, onCreate } = props;

  return (
    <React.Fragment>
      {successMessage && <AlertComponent type="success" message={successMessage} toast closable />}
      <Layout pageTitle="Customer List">
        <PageLayout
          title="Customer List"
          subtitle="Manage customer profiles and contact info"
          breadcrumbs={["Master", "Master Customer"]}
          headerRight={
            <button
              type="button"
              onClick={onCreate}
              className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-lg font-bold text-action-primary transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30 lg:hidden"
            >
              Create New
            </button>
          }
          mobileHeaderClassName="px-0"
          mobileTitleClassName="text-4xl"
          onBack={onBack}
        >
          <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
            {_renderMobileList(props)}
            {_renderDesktopList(props)}
          </div>
        </PageLayout>
      </Layout>
    </React.Fragment>
  );
};

export default MasterCustomerComponent;
