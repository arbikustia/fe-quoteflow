import * as React from "react";
import { FiDownload } from "react-icons/fi";

import { formatIndonesianDateTime } from "@/utils/date.helpers";

import ConfirmModal from "@/components/ConfirmModal";
import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import { OrderMobileCard } from "./Report.helper";
import type { ReportOrderData, ReportOrderProps } from "./Report.type";
import { getOrderRowNumber, getOrderStatusClass, getOrderStatusLabel, isOrderDone } from "./Report.util";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

/**
 * Render order status cell.
 * @param {ReportOrderData} row - Report order row data
 * @returns {React.ReactElement} - Status cell
 */
const _renderStatus = (row: ReportOrderData): React.ReactElement => (
  <span className={`inline-flex rounded-full px-4 py-1.5 text-lg font-semibold uppercase ${getOrderStatusClass(row)}`}>
    {getOrderStatusLabel(row)}
  </span>
);

/**
 * Render order action cell.
 * @param {ReportOrderData} row - Report order row data
 * @param {(order: ReportOrderData) => void} onEditStatus - Edit status callback
 * @returns {React.ReactElement} - Action cell
 */
const _renderActions = (row: ReportOrderData, onEditStatus: (order: ReportOrderData) => void): React.ReactElement => {
  const isDone = isOrderDone(row);

  /**
   * Open the confirmation for this row without triggering the row click.
   * @param {React.MouseEvent} event - Click event
   * @returns {void} - Nothing
   */
  const handleEdit = (event: React.MouseEvent): void => {
    event.stopPropagation();
    onEditStatus(row);
  };

  return (
    <button
      type="button"
      onClick={handleEdit}
      disabled={isDone}
      className={`cursor-pointer rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${
        isDone
          ? "bg-background-subtle text-text-tertiary cursor-not-allowed"
          : "bg-action-primary text-text-inverse hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      }`}
      aria-label={`Confirm order ${row.orderNo}`}
    >
      {isDone ? "Done" : "Confirm"}
    </button>
  );
};

/**
 * Render order row number cell.
 * @param {ReportOrderData} _row - Report order row data
 * @param {number} index - Zero-based row index
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @returns {React.ReactElement} - Number cell
 */
const _renderNumber = (_row: ReportOrderData, index: number, currentPage: number, pageSize: number): React.ReactElement => (
  <span className="text-lg">{getOrderRowNumber(currentPage, pageSize, index)}</span>
);

/**
 * Create a plain text table column.
 * @param {string} key - Column key
 * @param {string} header - Column header
 * @param {(row: ReportOrderData) => string} getValue - Cell value getter
 * @param {string} [className] - Extra cell classes
 * @returns {TableColumn<ReportOrderData>} - Text column
 */
const _createTextColumn = (key: string, header: string, getValue: (row: ReportOrderData) => string, className = ""): TableColumn<ReportOrderData> => {
  /**
   * Render the text cell.
   * @param {ReportOrderData} row - Row data
   * @returns {React.ReactElement} - Text cell
   */
  const render = (row: ReportOrderData): React.ReactElement => <span className={`text-lg ${className}`.trim()}>{getValue(row)}</span>;

  return { key, header, render };
};

/**
 * Build report table columns.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {(order: ReportOrderData) => void} onEditStatus - Edit status callback
 * @returns {TableColumn<ReportOrderData>[]} - Report order columns
 */
const _getColumns = (currentPage: number, pageSize: number, onEditStatus: (order: ReportOrderData) => void): TableColumn<ReportOrderData>[] => {
  /**
   * Render order number.
   * @param {ReportOrderData} row - Row data
   * @param {number} index - Row index
   * @returns {React.ReactElement} - Number cell
   */
  const renderNumber = (row: ReportOrderData, index: number): React.ReactElement => _renderNumber(row, index, currentPage, pageSize);

  /**
   * Render row actions.
   * @param {ReportOrderData} row - Row data
   * @returns {React.ReactElement} - Action cell
   */
  const renderActions = (row: ReportOrderData): React.ReactElement => _renderActions(row, onEditStatus);

  return [
    { key: "no", header: "No", align: "center", render: renderNumber },
    _createTextColumn("orderNo", "Order No", (row) => row.orderNo, "font-medium"),
    _createTextColumn("customerName", "Customer Name", (row) => row.customerName),
    _createTextColumn("eventName", "Event Name", (row) => row.eventName),
    _createTextColumn("address", "Location", (row) => row.address),
    _createTextColumn("startDate", "Start Date", (row) => formatIndonesianDateTime(row.startDate)),
    _createTextColumn("endDate", "End Date", (row) => formatIndonesianDateTime(row.endDate)),
    { key: "status", header: "Status", align: "center", render: _renderStatus },
    { key: "actions", header: "Action", align: "center", render: renderActions },
  ];
};

const SKELETON_WIDTHS = ["w-6", "w-28", "w-32", "w-36", "w-24", "w-24", "w-24"];

/**
 * Get the table row key.
 * @param {ReportOrderData} row - Report order row data
 * @returns {string} - Row key
 */
const _getOrderKey = (row: ReportOrderData): string => row.id;

/**
 * Render loading, empty, and error states.
 * @param {ReportOrderProps} props - The component props
 * @returns {React.ReactElement | null} - The state element when no rows should render
 */
const _renderListState = (props: ReportOrderProps): React.ReactElement | null => {
  const { errorMessage, isEmpty, isMissingData } = props;

  if (isMissingData) return <p className="py-10 text-center text-lg text-danger">Order data is unavailable. Please try again.</p>;

  if (errorMessage) return <p className="py-10 text-center text-lg text-danger">{errorMessage}</p>;

  if (isEmpty) return <p className="py-10 text-center text-lg text-text-secondary">No orders found.</p>;

  return null;
};

/**
 * Render a skeleton cell.
 * @param {TableColumn<ReportOrderData>} column - Column definition
 * @param {number} columnIndex - Column index
 * @returns {React.ReactElement} - Skeleton cell
 */
const _renderSkeletonCell = (column: TableColumn<ReportOrderData>, columnIndex: number): React.ReactElement => (
  <td
    key={column.key}
    className={`border-b border-border-default px-5 py-4 ${column.align === "center" ? "text-center" : "text-left"}`}
  >
    {column.key === "actions" ? (
      <div className="flex justify-center gap-1">
        <span className="h-10 w-10 rounded-3xl bg-background-subtle" />
      </div>
    ) : (
      <span
        className={`inline-block h-5 rounded-3xl bg-background-subtle align-middle ${
          column.key === "status" ? "w-28 rounded-full" : (SKELETON_WIDTHS[columnIndex] ?? "w-20")
        }`}
      />
    )}
  </td>
);

/**
 * Render a skeleton header cell.
 * @param {TableColumn<ReportOrderData>} column - Column definition
 * @param {number} index - Column index
 * @param {number} total - Total column count
 * @returns {React.ReactElement} - Skeleton header cell
 */
const _renderSkeletonHeader = (column: TableColumn<ReportOrderData>, index: number, total: number): React.ReactElement => (
  <th
    key={column.key}
    className={`bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary ${
      column.align === "center" ? "text-center" : "text-left"
    } ${index === 0 ? "rounded-l-3xl" : ""} ${index === total - 1 ? "rounded-r-3xl" : ""}`}
  >
    {column.header}
  </th>
);

/**
 * Render report table skeleton with quotation-style geometry.
 * @param {TableColumn<ReportOrderData>[]} columns - Columns
 * @returns {React.ReactElement} - Table skeleton element
 */
const _renderTableSkeleton = (columns: TableColumn<ReportOrderData>[]): React.ReactElement => (
  <div className="w-full overflow-x-auto" role="status" aria-label="Loading">
    <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
      <thead>
        <tr>{columns.map((column, index) => _renderSkeletonHeader(column, index, columns.length))}</tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }, (_value, rowIndex) => (
          <tr key={rowIndex} className="animate-pulse">{columns.map(_renderSkeletonCell)}</tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * Render desktop search and export toolbar.
 * @param {ReportOrderProps["setSearchTerm"]} setSearchTerm - Search callback
 * @param {() => void} onExport - Export callback
 * @param {boolean} isExporting - Whether an export is running
 * @returns {React.ReactElement} - Toolbar element
 */
const _renderDesktopToolbar = (setSearchTerm: ReportOrderProps["setSearchTerm"], onExport: () => void, isExporting: boolean): React.ReactElement => {
  /**
   * Handle search input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Change event
   * @returns {void} - Nothing
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
      <SearchFilter placeholder="Search order" onChange={handleSearchChange} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" />
      <button
        type="button"
        onClick={onExport}
        disabled={isExporting}
        aria-label="Export report"
        className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full border-2 border-action-primary bg-background-surface px-6 text-lg font-semibold text-action-primary transition-colors hover:bg-action-primary-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-wait disabled:opacity-60"
      >
        <FiDownload className="h-5 w-5" aria-hidden="true" />
        {isExporting ? "Exporting…" : "Export"}
      </button>
    </div>
  );
};

/**
 * Render desktop table view.
 * @param {ReportOrderProps} props - Component props
 * @returns {React.ReactElement} - Desktop table element
 */
const _renderDesktopTable = (props: ReportOrderProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, goToPage, pageSize, changePageSize, onEditStatus, setSearchTerm, totalCount, onExport, isExporting, isLoading } = props;
  const columns = _getColumns(currentPage, pageSize, onEditStatus);

  return (
    <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      {_renderDesktopToolbar(setSearchTerm, onExport, isExporting)}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          _renderTableSkeleton(columns)
        ) : (
          _renderListState(props) ?? (
            <Table
              data={paginatedData}
              columns={columns}
              isDetail={false}
              keyExtractor={_getOrderKey}
            />
          )
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
 * Render mobile search.
 * @param {ReportOrderProps["setSearchTerm"]} setSearchTerm - Search callback
 * @returns {React.ReactElement} - Search field
 */
const _renderMobileSearch = (setSearchTerm: ReportOrderProps["setSearchTerm"]): React.ReactElement => {
  /**
   * Handle mobile search input.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search change event
   * @returns {void} - Nothing
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <SearchFilter
      placeholder="Search order"
      onChange={handleSearchChange}
      isRoundedFull={true}
      className="w-full sm:w-full"
      inputClassName="!h-16 text-xl placeholder:text-xl"
    />
  );
};

/**
 * Render loading card with quotation card geometry.
 * @param {number} key - Skeleton key
 * @returns {React.ReactElement} - Loading card
 */
const _renderMobileCardSkeleton = (key: number): React.ReactElement => (
  <div
    key={key}
    className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small"
    role="status"
    aria-label="Loading order report card"
  >
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="h-7 w-28 rounded-3xl bg-background-subtle" />
      <div className="h-8 w-24 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 grid grid-cols-3 gap-x-3 gap-y-2">
      <div className="h-6 w-14 rounded-3xl bg-background-subtle" /><div className="col-span-2 h-6 w-4/5 rounded-3xl bg-background-subtle" />
      <div className="h-6 w-16 rounded-3xl bg-background-subtle" /><div className="col-span-2 h-6 w-3/5 rounded-3xl bg-background-subtle" />
    </div>
    <div className="mt-4 border-t border-border-default pt-4">
      <div className="h-6 w-20 rounded-3xl bg-background-subtle" />
      <div className="mt-1 h-6 w-full rounded-3xl bg-background-subtle" />
      <div className="mt-4 flex items-end justify-between gap-4 border-t border-border-default pt-4">
        <div className="h-6 w-12 rounded-3xl bg-background-subtle" /><div className="h-7 w-28 rounded-3xl bg-background-subtle" />
      </div>
    </div>
  </div>
);

/**
 * Render mobile order cards list view.
 * @param {ReportOrderProps} props - Component props
 * @returns {React.ReactElement} - Mobile list element
 */
const _renderMobileCards = (props: ReportOrderProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, goToPage, pageSize, changePageSize, setSearchTerm, totalCount, onEditStatus, isLoading } = props;

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <div className="w-full">{_renderMobileSearch(setSearchTerm)}</div>
      <div className="flex min-w-0 flex-col gap-4">
        {isLoading
          ? Array.from({ length: 5 }, (_value, index) => _renderMobileCardSkeleton(index))
          : _renderListState(props) ??
            paginatedData.map((order) => <OrderMobileCard key={order.id} order={order} onEditStatus={onEditStatus} />)}
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
 * Report Order Component.
 * @param {ReportOrderProps} props - Component props
 * @returns {React.ReactElement} - Report Order component
 */
export const ReportOrderComponent = (props: ReportOrderProps): React.ReactElement => {
  const { onBack, confirmOrder, confirmMessage, isSubmitting, onConfirm, onCancelConfirm } = props;

  return (
    <Layout pageTitle="Order Report">
      <PageLayout
        title="Order Report"
        subtitle="Track all rental order status and manage records."
        breadcrumbs={["Report", "Order Report"]}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={onBack}
      >
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobileCards(props)}
          {_renderDesktopTable(props)}
        </div>
      </PageLayout>
      <ConfirmModal
        isOpen={Boolean(confirmOrder)}
        onClose={onCancelConfirm}
        onConfirm={onConfirm}
        title="Confirm Completion"
        message={confirmMessage}
        confirmText={isSubmitting ? "Saving…" : "Save"}
        cancelText="Cancel"
      />
    </Layout>
  );
};

export default ReportOrderComponent;
