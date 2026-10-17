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
          className="rounded-xl bg-brand-blue h-14 px-6 text-sm font-semibold text-brand-white shadow-sm transition-colors hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        >
          Create Customer
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {_renderListState(props) ?? <Table data={paginatedData} columns={columns} isDetail={false} onRowClick={onRowClick} keyExtractor={(r: CustomerData) => r.id} />}
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
  const { paginatedData, currentPage, totalPages, goToPage, pageSize, changePageSize, setSearchTerm, totalCount, onEdit, onDetail, isDetail } = props;

  return (
    <div className="lg:hidden flex min-w-0 flex-col gap-4 pt-2 pb-16">
      <div className="w-full">{_renderMobileSearch(setSearchTerm)}</div>
      <div className="min-w-0 space-y-3">
        {_renderListState(props) ?? paginatedData.map((customer) => (
          <CustomerMobileCard key={customer.id} customer={customer} isDetail={isDetail} onEdit={onEdit} onDetail={onDetail} />
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
        className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs"
      />
    </div>
  );
};

/**
 * Render mobile search.
 * @param {MasterCustomerProps["setSearchTerm"]} setSearchTerm - Search callback
 * @returns {React.ReactElement} Search field
 */
const _renderMobileSearch = (setSearchTerm: MasterCustomerProps["setSearchTerm"]): React.ReactElement => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return <SearchFilter placeholder="Search customer" onChange={handleSearchChange} isRoundedFull={true} className="w-full sm:w-full" />;
};

/**
 * Master Customer Component
 * @param {MasterCustomerProps} props - The component props
 * @returns {React.ReactElement} The component
 */
export const MasterCustomerComponent = (props: MasterCustomerProps): React.ReactElement => {
  const { onBack, onCreate } = props;
  const createButton = (
    <button
      type="button"
      onClick={onCreate}
      className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-sm font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30"
    >
      Create New
    </button>
  );

  return (
    <Layout pageTitle="Customer List" mobileWhiteBackground={true}>
      <PageLayout
        title="Customer List"
        breadcrumbs={["Master", "Master Customer"]}
        headerRight={createButton}
        mobileHeaderClassName="px-6"
        onBack={onBack}
      >
        <div className="relative flex h-full flex-col bg-background-surface px-6 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobileCards(props)}
          {_renderDesktopTable(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
