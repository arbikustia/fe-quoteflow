import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import type { TableColumn } from "../../components/Table";
import Table from "../../components/Table";
import { formatIndonesianDateTime } from "../../utils/date.helpers";

import type { MasterPaymentMethodProps, PaymentMethodData } from "./MasterPaymentMethod.type";

/** Build payment method table columns.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {(paymentMethod: PaymentMethodData) => void} onEdit - Edit handler
 * @returns {TableColumn<PaymentMethodData>[]} Table columns
 */
// eslint-disable-next-line max-lines-per-function
const _getColumns = (currentPage: number, pageSize: number, onEdit: (paymentMethod: PaymentMethodData) => void): TableColumn<PaymentMethodData>[] => {
  /** Render row number.
   * @param {PaymentMethodData} _row - Row data
   * @param {number} index - Row index
   * @returns {React.ReactElement} Number cell
   */
  const renderNumber = (_row: PaymentMethodData, index: number): React.ReactElement => <span className="text-lg text-text-secondary">{(currentPage - 1) * pageSize + index + 1}</span>;
  /** Render status.
   * @param {PaymentMethodData} row - Row data
   * @returns {React.ReactElement} Status cell
   */
  const renderStatus = (row: PaymentMethodData): React.ReactElement => (
    <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${row.status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
      {row.status}
    </span>
  );
  /** Render name.
   * @param {PaymentMethodData} row - Row data
   * @returns {React.ReactElement} Name cell
   */
  const renderName = (row: PaymentMethodData): React.ReactElement => <span className="text-lg font-medium text-text-primary">{row.name}</span>;
  /** Render description.
   * @param {PaymentMethodData} row - Row data
   * @returns {React.ReactElement} Description cell
   */
  const renderDescription = (row: PaymentMethodData): React.ReactElement => <span className="text-lg text-text-secondary">{row.description}</span>;
  /** Render created date.
   * @param {PaymentMethodData} row - Row data
   * @returns {React.ReactElement} Created date cell
   */
  const renderCreatedAt = (row: PaymentMethodData): React.ReactElement => (
    <span className="text-lg text-text-secondary">
      {row.createAt ? formatIndonesianDateTime(row.createAt) : "-"}
    </span>
  );
  /** Render edit action.
   * @param {PaymentMethodData} row - Row data
   * @returns {React.ReactElement} Edit button
   */
  const renderActions = (row: PaymentMethodData): React.ReactElement => {
    /** Open editing without triggering row navigation.
     * @param {React.MouseEvent} event - Click event
     * @returns {void} No return value
     */
    const handleEdit = (event: React.MouseEvent): void => { event.stopPropagation(); onEdit(row); };

    return (
      <button
        type="button"
        onClick={handleEdit}
        className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
        title="Edit payment method"
        aria-label="Edit payment method"
      >
        <FiEdit2 className="h-5 w-5" />
      </button>
    );
  };

  return [
    { key: "no", header: "No", align: "center", render: renderNumber },
    { key: "name", header: "Payment Method", render: renderName },
    { key: "description", header: "Description", render: renderDescription },
    { key: "status", header: "Status", align: "center", render: renderStatus },
    { key: "createAt", header: "Created At", render: renderCreatedAt },
    { key: "actions", header: "Action", align: "center", render: renderActions },
  ];
};

/**
 * Render list state.
 * @param {MasterPaymentMethodProps} props - Component props
 * @returns {React.ReactElement | null} State element
 */
const _renderListState = (props: MasterPaymentMethodProps): React.ReactElement | null => {
  if (props.isMissingData) return <p className="py-10 text-center text-lg lg:text-sm text-red-600">Payment method data is unavailable. Please try again.</p>;

  if (props.errorMessage) return <p className="py-10 text-center text-lg lg:text-sm text-red-600">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-lg lg:text-sm text-text-secondary">No payment methods found.</p>;

  return null;
};

/**
 * Render payment method mobile card.
 * @param {PaymentMethodData} paymentMethod - Payment method data
 * @param {MasterPaymentMethodProps["onEdit"]} onEdit - Edit action
 * @returns {React.ReactElement} Card element
 */
const _renderPaymentMethodCard = (paymentMethod: PaymentMethodData, onEdit: MasterPaymentMethodProps["onEdit"]): React.ReactElement => {
  /**
   * Open payment method editing.
   * @returns {void} No return value
   */
  const handleCardClick = (): void => onEdit(paymentMethod);

  return (
    <button
      type="button"
      onClick={handleCardClick}
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{paymentMethod.name}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${paymentMethod.status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
          {paymentMethod.status}
        </span>
      </span>
      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
        <span className="min-w-0 text-lg text-text-secondary">
          <span className="block text-lg text-text-tertiary">Description</span>
          <span className="mt-1 block break-words text-lg font-medium text-text-primary">{paymentMethod.description ?? "No description"}</span>
        </span>
      </span>
    </button>
  );
};

/**
 * Render payment method table skeleton.
 * @param {MasterPaymentMethodProps} props - Component props
 * @returns {React.ReactElement} Table skeleton
 */
const _renderTableSkeleton = (props: MasterPaymentMethodProps): React.ReactElement => {
  const columns = _getColumns(props.currentPage, props.pageSize, props.onEdit);
  const widths = ["w-6", "w-40", "w-48", "w-28", "w-28"];

  return (
    <div className="w-full overflow-x-auto" role="status" aria-label="Loading payment method table">
      <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={column.key} className={`bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary ${column.align === "center" ? "text-center" : "text-left"} ${index === 0 ? "rounded-l-3xl" : ""} ${index === columns.length - 1 ? "rounded-r-3xl" : ""}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }, (_value, rowIndex) => (
            <tr key={rowIndex} className="animate-pulse">
              {columns.map((column, columnIndex) => (
                <td key={column.key} className={`border-b border-border-default px-5 py-4 ${column.align === "center" ? "text-center" : "text-left"}`}>
                  {column.key === "actions" ? (
                    <span className="inline-block h-10 w-10 rounded-3xl bg-background-subtle" />
                  ) : (
                    <span className={`inline-block h-5 rounded-3xl bg-background-subtle align-middle ${column.key === "status" ? "w-28 rounded-full" : widths[columnIndex]}`} />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Render payment method mobile card skeleton.
 * @param {number} key - Skeleton key
 * @returns {React.ReactElement} Card skeleton
 */
const _renderMobileCardSkeleton = (key: number): React.ReactElement => (
  <div key={key} className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small" role="status" aria-label="Loading payment method card">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="h-7 w-40 rounded-3xl bg-background-subtle" />
      <span className="h-8 w-24 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <div>
        <div className="h-7 w-28 rounded-3xl bg-background-subtle" />
        <div className="mt-1 h-7 w-48 rounded-3xl bg-background-subtle" />
      </div>
    </div>
  </div>
);

/**
 * Render mobile list.
 * @param {MasterPaymentMethodProps} props - Component props
 * @returns {React.ReactElement} Mobile list
 */
const _renderMobile = (props: MasterPaymentMethodProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, pageSize, totalCount, goToPage, changePageSize, setSearchTerm, onEdit } = props;
  /**
   * Update search term.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search input event
   * @returns {void} No return value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter placeholder="Search payment method" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="!h-16 text-xl placeholder:text-xl" />
      <div className="flex min-w-0 flex-col gap-4">
        {props.isLoading ? (
          Array.from({ length: 5 }, (_value, index) => _renderMobileCardSkeleton(index))
        ) : (
          _renderListState(props) ?? paginatedData.map((paymentMethod) => (
            <React.Fragment key={paymentMethod.id}>{_renderPaymentMethodCard(paymentMethod, onEdit)}</React.Fragment>
          ))
        )}
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
 * Render desktop table.
 * @param {MasterPaymentMethodProps} props - Component props
 * @returns {React.ReactElement} Desktop table
 */
const _renderDesktop = (props: MasterPaymentMethodProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, pageSize, totalCount, goToPage, changePageSize, setSearchTerm, onCreate, onEdit } = props;
  const columns = _getColumns(currentPage, pageSize, onEdit);
  /**
   * Update search term.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search input event
   * @returns {void} No return value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);
  /**
   * Extract payment method row key.
   * @param {PaymentMethodData} row - Payment method row
   * @returns {string} Payment method ID
   */
  const keyExtractor = (row: PaymentMethodData): string => row.id;

  return (
    <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
        <SearchFilter placeholder="Search payment method" onChange={handleSearch} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" />
        <button type="button" onClick={onCreate} className="h-14 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">Create Payment Method</button>
      </div>
      <div className="flex-1 overflow-auto">
        {props.isLoading ? (
          _renderTableSkeleton(props)
        ) : (
          _renderListState(props) ?? <Table data={paginatedData} columns={columns} keyExtractor={keyExtractor} />
        )}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} onPageChange={goToPage} onPageSizeChange={changePageSize} totalItems={totalCount} className="pt-4" />
    </div>
  );
};

/**
 * Render master payment method page.
 * @param {MasterPaymentMethodProps} props - Component props
 * @returns {React.ReactElement} Page element
 */
export const MasterPaymentMethodComponent = (props: MasterPaymentMethodProps): React.ReactElement => {
  const { onBack, onCreate } = props;
  const createButton = (
    <button type="button" onClick={onCreate} className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-lg font-bold text-action-primary transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30 lg:hidden">
      Create New
    </button>
  );

  return (
    <Layout pageTitle="Payment Method List">
      <PageLayout title="Payment Method List" subtitle="Manage available payment methods" breadcrumbs={["Master", "Master Payment Method"]} headerRight={createButton} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={onBack}>
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props)}
          {_renderDesktop(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
