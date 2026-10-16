import * as React from "react";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table from "../../components/Table";

import { CustomerMobileCard } from "./CustomerMobileCard.helpers";
import type { CustomerData, MasterCustomerProps } from "./MasterCustomer.type";

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
  const { paginatedData, columns, currentPage, totalPages, goToPage, pageSize, changePageSize, onRowClick, onCreate, setSearchTerm, totalCount } = props;

  /**
   * Handle search input change
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event
   * @returns {void}
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="hidden lg:px-6 md:flex bg-brand-white rounded-4xl border border-brand-gray-light shadow-xs flex-col flex-1 overflow-hidden mt-6">
      <div className="flex items-center justify-between gap-4 py-6 border-brand-gray-light">
        <SearchFilter placeholder="Search customer" onChange={handleSearchChange} />
        <button
          type="button"
          onClick={onCreate}
          className="rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-brand-white shadow-sm transition-colors hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        >
          Create Customer
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {_renderListState(props) ?? <Table data={paginatedData} columns={columns} onRowClick={onRowClick} keyExtractor={(r: CustomerData) => r.id} />}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} onPageChange={goToPage} onPageSizeChange={changePageSize} totalItems={totalCount} />
    </div>
  );
};

/**
 * Render mobile customer cards list view
 * @param {MasterCustomerProps} props - The component props
 * @returns {React.ReactElement} The mobile list element
 */
const _renderMobileCards = (props: MasterCustomerProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, goToPage, pageSize, changePageSize, onRowClick, onCreate, setSearchTerm, totalCount, onEdit } = props;

  return (
    <div className="lg:hidden flex min-w-0 flex-col gap-4 pt-2 pb-16">
      {_renderMobileToolbar(onCreate, setSearchTerm)}
      <div className="min-w-0 space-y-3">
        {_renderListState(props) ?? paginatedData.map((customer) => (
          <CustomerMobileCard key={customer.id} customer={customer} onRowClick={onRowClick} onEdit={onEdit} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        totalItems={totalCount}
        isCompact={true}
        className="w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs mt-2"
      />
    </div>
  );
};

/**
 * Render mobile search and create controls.
 * @param {MasterCustomerProps["onCreate"]} onCreate - Create callback
 * @param {MasterCustomerProps["setSearchTerm"]} setSearchTerm - Search callback
 * @returns {React.ReactElement} Toolbar node
 */
const _renderMobileToolbar = (onCreate: MasterCustomerProps["onCreate"], setSearchTerm: MasterCustomerProps["setSearchTerm"]): React.ReactElement => {
  /**
   * Handle search input change
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event
   * @returns {void}
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="flex w-full items-center justify-between gap-3 bg-transparent">
      <div className="flex-1">
        <SearchFilter placeholder="Search customer" onChange={handleSearchChange} />
      </div>
      <button type="button" onClick={onCreate} className="shrink-0 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-brand-white shadow-sm hover:bg-brand-blue/90 transition-colors">
        Create Customer
      </button>
    </div>
  );
};

/**
 * Master Customer Component
 * @param {MasterCustomerProps} props - The component props
 * @returns {React.ReactElement} The component
 */
export const MasterCustomerComponent = (props: MasterCustomerProps): React.ReactElement => {
  const { onBack } = props;

  return (
    <Layout pageTitle="Customer List">
      <PageLayout
        title="Customer List"
        breadcrumbs={["Master", "Master Customer"]}
        onBack={onBack}
      >
        <div className="flex flex-col h-full pb-18 lg:pb-0 px-3 lg:px-0 lg:-mt-4 relative">
          {_renderMobileCards(props)}
          {_renderDesktopTable(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
