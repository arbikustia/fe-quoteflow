import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import { SkeletonComponent } from "../../components/Skeleton";
import type { TableColumn } from "../../components/Table";
import Table from "../../components/Table";

import { CustomerMobileCard, getCustomerRowNumber } from "./MasterCustomer.helpers";
import type { CustomerData, MasterCustomerProps } from "./MasterCustomer.type";

/**
 * Render customer status cell.
 * @param {CustomerData} row - Customer row data
 * @returns {React.ReactElement} Status cell
 */
const _renderStatus = (row: CustomerData): React.ReactElement => (
  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
    {row.status}
  </span>
);

/**
 * Render customer action cell.
 * @param {CustomerData} row - Customer row data
 * @param {(customer: CustomerData) => void} onEdit - Edit handler
 * @returns {React.ReactElement} Action cell
 */
const _renderActions = (row: CustomerData, onEdit: (customer: CustomerData) => void): React.ReactElement => {
  /**
   * Handle edit button.
   * @param {React.MouseEvent} event - Mouse event
   * @returns {void} No return value
   */
  const handleEdit = (event: React.MouseEvent): void => {
    event.stopPropagation();
    onEdit(row);
  };

  return <button type="button" onClick={handleEdit} className="cursor-pointer rounded-lg p-1.5 text-brand-text-medium transition-colors hover:bg-brand-blue-light hover:text-brand-blue" title="Edit"><FiEdit2 className="h-4 w-4" /></button>;
};

/**
 * Render customer row number cell.
 * @param {CustomerData} _row - Customer row data
 * @param {number} index - Zero-based row index
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @returns {React.ReactElement} Number cell
 */
const _renderNumber = (_row: CustomerData, index: number, currentPage: number, pageSize: number): React.ReactElement => (
  <span className="text-sm">{getCustomerRowNumber(currentPage, pageSize, index)}</span>
);

/**
 * Build customer table columns.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {(customer: CustomerData) => void} onEdit - Edit handler
 * @returns {TableColumn<CustomerData>[]} Customer columns
 */
const _getColumns = (currentPage: number, pageSize: number, onEdit: (customer: CustomerData) => void): TableColumn<CustomerData>[] => {
  /**
   * Render customer number.
   * @param {CustomerData} row - Customer row data
   * @param {number} index - Zero-based row index
   * @returns {React.ReactElement} Number cell
   */
  const renderNumber = (row: CustomerData, index: number): React.ReactElement => _renderNumber(row, index, currentPage, pageSize);

  /**
   * Render customer action.
   * @param {CustomerData} row - Customer row data
   * @returns {React.ReactElement} Action cell
   */
  const renderAction = (row: CustomerData): React.ReactElement => _renderActions(row, onEdit);

  return [
    { key: "no", header: "No", align: "center", render: renderNumber },
    { key: "name", header: "Customer Name" },
    { key: "address", header: "Address" },
    { key: "phoneNumber", header: "Phone Number" },
    { key: "status", header: "Status", align: "center", render: _renderStatus },
    { key: "actions", header: "Action", align: "center", render: renderAction },
  ];
};

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
  const { paginatedData, currentPage, totalPages, goToPage, pageSize, changePageSize, onRowClick, onCreate, setSearchTerm, totalCount, onEdit } = props;
  const columns = _getColumns(currentPage, pageSize, onEdit);

  /**
   * Handle search input change
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event
   * @returns {void}
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="hidden rounded-4xl border border-border-default bg-background-surface px-6 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
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
        {props.isLoading ? (
          <SkeletonComponent rows={5} columns={[{ width: "8%" }, { width: "28%" }, { width: "34%" }, { width: "20%" }, { width: "10%" }]} />
        ) : _renderListState(props) ?? <Table data={paginatedData} columns={columns} isDetail={false} onRowClick={onRowClick} keyExtractor={(r: CustomerData) => r.id} />}
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
  const { paginatedData, currentPage, totalPages, goToPage, pageSize, changePageSize, setSearchTerm, totalCount, onEdit } = props;

  return (
    <div className="lg:hidden flex min-w-0 flex-col gap-4 pt-2 pb-16">
      <div className="w-full">{_renderMobileSearch(setSearchTerm)}</div>
      <div className="min-w-0 space-y-3">
        {_renderListState(props) ?? paginatedData.map((customer) => (
          <CustomerMobileCard key={customer.id} customer={customer} onEdit={onEdit} />
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
  /**
   * Handle mobile search input.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search change event
   * @returns {void}
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return <SearchFilter placeholder="Search customer" onChange={handleSearchChange} isRoundedFull={true} className="w-full sm:w-full" inputClassName="text-lg placeholder:text-lg" />;
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
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={onBack}
      >
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobileCards(props)}
          {_renderDesktopTable(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
