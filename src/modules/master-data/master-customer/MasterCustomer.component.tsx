import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import Layout from "../../../app/layout";
import { PageLayout } from "../../../app/shared/PageLayout";
import { Pagination } from "../../../components/Pagination";
import { SearchFilter } from "../../../components/SearchFilter";
import type { TableColumn } from "../../../components/Table";
import Table from "../../../components/Table";

import { CustomerMobileCard, formatCustomerDisplayValue, getCustomerRowNumber } from "./MasterCustomer.helpers";
import type { CustomerData, MasterCustomerProps } from "./MasterCustomer.type";

/**
 * Render customer status cell.
 *
 * @param {CustomerData} row - Customer row data
 * @returns {React.ReactElement} Status cell
 */
const _renderStatus = (row: CustomerData): React.ReactElement => {
  const isActive = row.status === "active";
  const badgeClass = isActive ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong";

  return (
    <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${badgeClass}`}>
      {row.status}
    </span>
  );
};

/**
 * Render customer action cell.
 *
 * @param {CustomerData} row - Customer row data
 * @param {(customer: CustomerData) => void} onEdit - Edit handler
 * @returns {React.ReactElement} Action cell
 */
const _renderActions = (row: CustomerData, onEdit: (customer: CustomerData) => void): React.ReactElement => {
    /**
   * Handle edit button.
   *
   * @param {React.MouseEvent} event - Mouse event
   * @returns {void} No return value
   */
  const handleEdit = (event: React.MouseEvent): void => {
    event.stopPropagation();
    onEdit(row);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={handleEdit}
        className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
        title="Edit customer"
        aria-label="Edit customer"
      >
        <FiEdit2 className="h-5 w-5" />
      </button>
    </div>
  );
};

/**
 * Render customer row number cell.
 *
 * @param {CustomerData} _row - Customer row data
 * @param {number} index - Zero-based row index
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @returns {React.ReactElement} Number cell
 */
const _renderNumber = (_row: CustomerData, index: number, currentPage: number, pageSize: number): React.ReactElement => (
  <span className="text-lg">{getCustomerRowNumber(currentPage, pageSize, index)}</span>
);

/**
 * Render customer name cell.
 *
 * @param {CustomerData} row - Customer row data
 * @returns {React.ReactElement} Name cell
 */
const _renderCustomerName = (row: CustomerData): React.ReactElement => (
  <span className="text-lg font-medium">{row.name}</span>
);

/**
 * Render customer email cell.
 *
 * @param {CustomerData} row - Customer row data
 * @returns {React.ReactElement} Email cell
 */
const _renderEmail = (row: CustomerData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{formatCustomerDisplayValue(row.email)}</span>
);

/**
 * Render customer address cell.
 *
 * @param {CustomerData} row - Customer row data
 * @returns {React.ReactElement} Address cell
 */
const _renderAddress = (row: CustomerData): React.ReactElement => (
  <span className="text-lg">{formatCustomerDisplayValue(row.address)}</span>
);

/**
 * Render customer phone number cell.
 *
 * @param {CustomerData} row - Customer row data
 * @returns {React.ReactElement} Phone number cell
 */
const _renderPhoneNumber = (row: CustomerData): React.ReactElement => (
  <span className="text-lg">{formatCustomerDisplayValue(row.phoneNumber)}</span>
);

/**
 * Build customer table columns.
 *
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {(customer: CustomerData) => void} onEdit - Edit handler
 * @returns {TableColumn<CustomerData>[]} Customer columns
 */
const _getColumns = (currentPage: number, pageSize: number, onEdit: (customer: CustomerData) => void): TableColumn<CustomerData>[] => {
    /**
   * Render customer number.
   *
   * @param {CustomerData} row - Customer row data
   * @param {number} index - Zero-based row index
   * @returns {React.ReactElement} Number cell
   */
  const renderNumber = (row: CustomerData, index: number): React.ReactElement => _renderNumber(row, index, currentPage, pageSize);

    /**
   * Render customer action.
   *
   * @param {CustomerData} row - Customer row data
   * @returns {React.ReactElement} Action cell
   */
  const renderAction = (row: CustomerData): React.ReactElement => _renderActions(row, onEdit);

  return [
    { key: "no", header: "No", align: "center", render: renderNumber },
    { key: "name", header: "Customer Name", render: _renderCustomerName },
    { key: "email", header: "Email", render: _renderEmail },
    { key: "address", header: "Address", render: _renderAddress },
    { key: "phoneNumber", header: "Phone Number", render: _renderPhoneNumber },
    { key: "status", header: "Status", align: "center", render: _renderStatus },
    { key: "actions", header: "Action", align: "center", render: renderAction },
  ];
};

/**
 * Render loading, empty, and error states.
 *
 * @param {MasterCustomerProps} props - The component props
 * @returns {React.ReactElement | null} The state element when no rows should render
 */
const _renderListState = (props: MasterCustomerProps): React.ReactElement | null => {
  const { errorMessage, isEmpty, isMissingData } = props;

  if (isMissingData) return <p className="py-10 text-center text-lg text-text-tertiary">Customer data is unavailable. Please try again.</p>;

  if (errorMessage) return <p className="py-10 text-center text-lg text-text-tertiary">{errorMessage}</p>;

  if (isEmpty) return <p className="py-10 text-center text-lg text-text-tertiary">No customers found.</p>;

  return null;
};

/**
 * Render action cell skeleton.
 *
 * @returns {React.ReactElement} Skeleton action cell
 */
const _renderActionSkeleton = (): React.ReactElement => (
  <div className="flex justify-center gap-1">
    <span className="h-10 w-10 rounded-3xl bg-background-subtle" />
  </div>
);

/**
 * Render single skeleton row in customer table.
 *
 * @param {TableColumn<CustomerData>[]} columns - Table columns
 * @param {string[]} widths - Column widths
 * @param {number} rowIndex - Row index
 * @returns {React.ReactElement} Skeleton row element
 */
const _renderSkeletonRow = (columns: TableColumn<CustomerData>[], widths: string[], rowIndex: number): React.ReactElement => (
  <tr key={rowIndex} className="animate-pulse">
    {columns.map((column, columnIndex) => (
      <td
        key={column.key}
        className={`border-b border-border-default px-5 py-4 ${column.align === "center" ? "text-center" : "text-left"}`}
      >
        {column.key === "actions" ? (
          _renderActionSkeleton()
        ) : (
          <span className={`inline-block h-5 rounded-3xl bg-background-subtle align-middle ${column.key === "status" ? "w-28 rounded-full" : widths[columnIndex]}`} />
        )}
      </td>
    ))}
  </tr>
);

/**
 * Render customer table skeleton with matching columns.
 *
 * @param {MasterCustomerProps} props - Component props
 * @returns {React.ReactElement} Customer table skeleton
 */
const _renderTableSkeleton = (props: MasterCustomerProps): React.ReactElement => {
  const columns = _getColumns(props.currentPage, props.pageSize, props.onEdit);
  const widths = ["w-6", "w-36", "w-44", "w-44", "w-32", "w-28"];

  return (
    <div className="w-full overflow-x-auto" role="status" aria-label="Loading customer table">
      <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key}
                className={`bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary ${column.align === "center" ? "text-center" : "text-left"} ${index === 0 ? "rounded-l-3xl" : ""} ${index === columns.length - 1 ? "rounded-r-3xl" : ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }, (_value, rowIndex) => _renderSkeletonRow(columns, widths, rowIndex))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Render customer mobile card skeleton.
 *
 * @param {number} key - Skeleton key
 * @returns {React.ReactElement} Customer mobile card skeleton
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
 * Render desktop toolbar with search and create button.
 *
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} handleSearch - Search change handler
 * @param {() => void} onCreate - Create handler
 * @returns {React.ReactElement} Toolbar element
 */
const _renderDesktopToolbar = (
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onCreate: () => void,
): React.ReactElement => (
  <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
    <SearchFilter
      placeholder="Search customer"
      onChange={handleSearch}
      isRoundedFull={true}
      inputClassName="text-lg placeholder:text-lg"
    />
    <button
      type="button"
      onClick={onCreate}
      className="h-14 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
    >
      Create Customer
    </button>
  </div>
);

/**
 * Render desktop table view.
 *
 * @param {MasterCustomerProps} props - The component props
 * @returns {React.ReactElement} The desktop table element
 */
const _renderDesktopTable = (props: MasterCustomerProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, goToPage, pageSize, changePageSize, onRowClick, onCreate, setSearchTerm, totalCount, onEdit } = props;
  const columns = _getColumns(currentPage, pageSize, onEdit);

    /**
   * Handle search input change.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event
   * @returns {void}
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      {_renderDesktopToolbar(handleSearchChange, onCreate)}
      <div className="flex-1 overflow-auto">
        {props.isLoading ? _renderTableSkeleton(props) : _renderListState(props) ?? (
          <Table
            data={paginatedData}
            columns={columns}
            isDetail={false}
            onRowClick={onRowClick ?? onEdit}
            keyExtractor={(r: CustomerData) => r.id}
          />
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        totalItems={totalCount}
        className="pt-4"
      />
    </div>
  );
};

/**
 * Render mobile customer cards list view.
 *
 * @param {MasterCustomerProps} props - The component props
 * @returns {React.ReactElement} The mobile list element
 */
const _renderMobileCards = (props: MasterCustomerProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, goToPage, pageSize, changePageSize, setSearchTerm, totalCount, onEdit } = props;

    /**
   * Handle mobile search input.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search change event
   * @returns {void}
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter
        placeholder="Search customer"
        onChange={handleSearchChange}
        isRoundedFull={true}
        className="w-full sm:w-full"
        inputClassName="!h-16 text-xl placeholder:text-xl"
      />
      <div className="flex min-w-0 flex-col gap-4">
        {props.isLoading ? (
          Array.from({ length: 5 }, (_value, index) => _renderMobileCardSkeleton(index))
        ) : _renderListState(props) ?? paginatedData.map((customer) => (
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
        className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs"
      />
    </div>
  );
};

/**
 * Master Customer Component.
 *
 * @param {MasterCustomerProps} props - The component props
 * @returns {React.ReactElement} The component
 */
export const MasterCustomerComponent = (props: MasterCustomerProps): React.ReactElement => {
  const { onBack, onCreate } = props;
  const createButton = (
    <button
      type="button"
      onClick={onCreate}
      className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-lg font-bold text-action-primary transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30 lg:hidden"
    >
      Create New
    </button>
  );

  return (
    <Layout pageTitle="Customer List">
      <PageLayout
        title="Customer List"
        subtitle="Manage customer profiles and contact info"
        breadcrumbs={["Master", "Master Customer"]}
        headerRight={createButton}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={onBack}
      >
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobileCards(props)}
          {_renderDesktopTable(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
