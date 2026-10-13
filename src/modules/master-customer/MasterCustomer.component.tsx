import * as React from "react";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Icons } from "../../components/Icons";
import type { MobileListItemProps } from "../../components/MobileList";
import { MobileList } from "../../components/MobileList";
import { PaginationFooter, PaginationHeader } from "../../components/Pagination";
import Table from "../../components/Table";

import type { CustomerData, MasterCustomerProps } from "./MasterCustomer.type";

/**
 * Render status badge
 * @param {CustomerData} row - The row data
 * @returns {React.ReactElement} The status badge element
 */
const _renderStatusBadge = (row: CustomerData): React.ReactElement => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap ${row.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
    {row.status}
  </span>
);

/**
 * Render loading, empty, and error states.
 * @param {MasterCustomerProps} props - The component props
 * @returns {React.ReactElement | null} The state element when no rows should render
 */
const _renderListState = (props: MasterCustomerProps): React.ReactElement | null => {
  const { isLoading, errorMessage, isEmpty, isMissingData } = props;

  if (isLoading) return <p className="py-10 text-center text-sm text-brand-text-medium">Loading customers…</p>;

  if (isMissingData) return <p className="py-10 text-center text-sm text-red-600">Customer data is unavailable. Please try again.</p>;

  if (errorMessage) return <p className="py-10 text-center text-sm text-red-600">{errorMessage}</p>;

  if (isEmpty) return <p className="py-10 text-center text-sm text-brand-text-medium">No customers found.</p>;

  return null;
};

/**
 * Render desktop table view
 * @param {MasterCustomerProps} props - The component props
 * @returns {React.ReactElement} The desktop table element
 */
const _renderDesktopTable = (props: MasterCustomerProps): React.ReactElement => {
  const { paginatedData, columns, currentPage, totalPages, goToPage, nextPage, prevPage, pageSize, totalCount, changePageSize, onRowClick, setSearchTerm } = props;

  /**
   * Handle search input change
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event
   * @returns {void}
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="hidden md:flex bg-brand-white rounded-xl border border-brand-gray-light shadow-sm flex-col flex-1 overflow-hidden mt-6">
      <div className="flex items-center justify-between p-5 px-6 border-b border-brand-gray-light">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-medium"><Icons.Search /></div>
          <input type="text" placeholder="Search customer" onChange={handleSearchChange} className="w-64 pl-10 pr-4 py-2 bg-brand-gray-light border-none rounded-lg text-sm focus:outline-none placeholder:text-brand-text-medium text-brand-text-dark" />
        </div>
        <PaginationHeader pageSize={pageSize} totalCount={totalCount} onPageSizeChange={changePageSize} />
      </div>
      <div className="flex-1 overflow-auto">
        {_renderListState(props) ?? <Table data={paginatedData} columns={columns} onRowClick={onRowClick} keyExtractor={(r: CustomerData) => r.id} />}
      </div>
      <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} onNextPage={nextPage} onPrevPage={prevPage} />
    </div>
  );
};

/**
 * Render mobile list view
 * @param {MasterCustomerProps} props - The component props
 * @returns {React.ReactElement} The mobile list element
 */
const _renderMobileList = (props: MasterCustomerProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, goToPage, nextPage, prevPage, pageSize, totalCount, changePageSize, onRowClick, setSearchTerm } = props;

  /**
   * Handle search input change
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event
   * @returns {void}
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  /**
   * Get mobile list data
   * @returns {MobileListItemProps[]} The formatted mobile list data
   */
  const getMobileListData = (): MobileListItemProps[] => paginatedData.map((row) => ({
    title: row.name,
    meta: row.address,
    hideImage: true,
    titleClassName: "text-xl font-semibold text-brand-text-dark leading-snug truncate",
    metaClassName: "text-base font-normal text-brand-text-medium/80 truncate",
    badge: _renderStatusBadge(row),
    /**
     * Handle row click
     * @returns {void}
     */
    onClick: (): void => onRowClick(row),
  }));

  return (
    <div className="md:hidden space-y-6 mt-10">
      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-medium"><Icons.Search /></div>
          <input
            type="text"
            placeholder="Search customer"
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-brand-gray-light border-none rounded-lg text-sm focus:outline-none placeholder:text-brand-text-medium text-brand-text-dark"
          />
        </div>
      </div>
      <div className="scale-100 origin-top">
        {_renderListState(props) ?? <MobileList data={getMobileListData()} />}
      </div>
      <div className="pt-4 flex items-center justify-between">
        <PaginationHeader pageSize={pageSize} totalCount={totalCount} onPageSizeChange={changePageSize} className="shrink-0" />
        <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} onNextPage={nextPage} onPrevPage={prevPage} />
      </div>
    </div>
  );
};

/**
 * Master Customer Component
 * @param {MasterCustomerProps} props - The component props
 * @returns {React.ReactElement} The component
 */
export const MasterCustomerComponent = (props: MasterCustomerProps): React.ReactElement => {
  const { onBack, onCreate, onDelete } = props;

  const actions = [
    { label: "New Customer", onClick: onCreate },
    { label: "Delete", onClick: onDelete, isDangerous: true },
  ];

  return (
    <Layout pageTitle="Customer List">
      <PageLayout
        title="Customer List"
        breadcrumbs={["Home", "Master", "Customer"]}
        actions={actions}
        onBack={onBack}
      >
        <div className="flex flex-col h-full pb-18 lg:pb-0 px-3 lg:px-0 lg:-mt-4 relative">
          {_renderMobileList(props)}
          {_renderDesktopTable(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
