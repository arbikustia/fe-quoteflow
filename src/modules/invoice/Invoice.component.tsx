import * as React from "react";
import { FiDownload, FiEdit2, FiEye } from "react-icons/fi";

import { formatIndonesianDateTime } from "@/utils/date.helpers";
import { generateInvoicePDF } from "@/utils/pdfGenerator";

import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import Table, { type TableColumn } from "@/components/Table";

import { getInvoiceRowNumber, InvoiceMobileCard, invoiceToQuoteData } from "./Invoice.helpers";
import type { InvoiceData, InvoiceProps } from "./Invoice.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";
import { getInvoiceStatusLabel, getStatusBadgeClass } from "@/modules/quotation/detail/QuotationDetail.helpers";

/**
 * Render row number cell.
 * @param {InvoiceData} _row - Invoice row
 * @param {number} index - Zero-based index
 * @param {InvoiceProps} props - Invoice props
 * @returns {React.ReactElement} Row number element
 */
const _renderRowNumber = (_row: InvoiceData, index: number, props: InvoiceProps): React.ReactElement => (
  <span className="text-lg">{getInvoiceRowNumber(props.currentPage, props.pageSize, index)}</span>
);

/**
 * Render invoice download action.
 * @param {InvoiceData} row - Invoice row
 * @returns {React.ReactElement} Download action button
 */
const _renderDownloadAction = (row: InvoiceData): React.ReactElement => (
  <button
    type="button"
    onClick={(event: React.MouseEvent): void => {
      event.stopPropagation();
      void generateInvoicePDF(invoiceToQuoteData(row));
    }}
    className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
    title="Download PDF"
    aria-label="Download PDF"
  >
    <FiDownload className="h-5 w-5" />
  </button>
);

/**
 * Render invoice detail action.
 * @param {InvoiceData} row - Invoice row
 * @param {InvoiceProps} props - Invoice props
 * @returns {React.ReactElement} Detail action button
 */
const _renderDetailAction = (row: InvoiceData, props: InvoiceProps): React.ReactElement => (
  <button
    type="button"
    onClick={(event: React.MouseEvent): void => {
      event.stopPropagation();
      props.onDetail(row);
    }}
    className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
    title="View invoice detail"
    aria-label="View invoice detail"
  >
    <FiEye className="h-5 w-5" />
  </button>
);

/**
 * Render invoice edit action.
 * @param {InvoiceData} row - Invoice row
 * @param {InvoiceProps} props - Invoice props
 * @returns {React.ReactElement} Edit action button
 */
const _renderEditAction = (row: InvoiceData, props: InvoiceProps): React.ReactElement => (
  <button
    type="button"
    onClick={(event: React.MouseEvent): void => {
      event.stopPropagation();
      props.onEdit(row);
    }}
    className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
    title="Edit invoice"
    aria-label="Edit invoice"
  >
    <FiEdit2 className="h-5 w-5" />
  </button>
);

/**
 * Render invoice status badge.
 * @param {InvoiceData} row - Invoice row
 * @returns {React.ReactElement} Status badge element
 */
const _renderStatus = (row: InvoiceData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${getStatusBadgeClass(row.status)}`}>
    {getInvoiceStatusLabel(row.status)}
  </span>
);

/**
 * Render row actions.
 * @param {InvoiceData} row - Invoice row
 * @param {InvoiceProps} props - Invoice props
 * @returns {React.ReactElement} Actions element
 */
const _renderActions = (row: InvoiceData, props: InvoiceProps): React.ReactElement => (
  <div className="flex items-center justify-center gap-1">
    {_renderDownloadAction(row)}
    {_renderDetailAction(row, props)}
    {row.status !== 2 && _renderEditAction(row, props)}
  </div>
);

/**
 * Render invoice number cell.
 * @param {InvoiceData} row - Invoice row
 * @returns {React.ReactElement} Invoice number element
 */
const _renderInvoiceNumber = (row: InvoiceData): React.ReactElement => (
  <span className="text-lg font-medium">{row.invoiceNumber}</span>
);

/**
 * Render customer name cell.
 * @param {InvoiceData} row - Invoice row
 * @returns {React.ReactElement} Customer name element
 */
const _renderCustomerName = (row: InvoiceData): React.ReactElement => (
  <span className="text-lg">{row.customerName}</span>
);

/**
 * Render event name cell.
 * @param {InvoiceData} row - Invoice row
 * @returns {React.ReactElement} Event name element
 */
const _renderEventName = (row: InvoiceData): React.ReactElement => (
  <span className="text-lg">{row.name}</span>
);

/**
 * Render invoice date cell.
 * @param {InvoiceData} row - Invoice row
 * @returns {React.ReactElement} Invoice date element
 */
const _renderInvoiceDate = (row: InvoiceData): React.ReactElement => (
  <span className="text-lg">{formatIndonesianDateTime(row.invoiceDate)}</span>
);

/**
 * Render event start date cell.
 * @param {InvoiceData} row - Invoice row
 * @returns {React.ReactElement} Start date element
 */
const _renderStartDate = (row: InvoiceData): React.ReactElement => (
  <span className="text-lg">{formatIndonesianDateTime(row.startDate)}</span>
);

/**
 * Render event end date cell.
 * @param {InvoiceData} row - Invoice row
 * @returns {React.ReactElement} End date element
 */
const _renderEndDate = (row: InvoiceData): React.ReactElement => (
  <span className="text-lg">{formatIndonesianDateTime(row.endDate)}</span>
);

/**
 * Build invoice table columns.
 * @param {InvoiceProps} props - Invoice component props
 * @returns {TableColumn<InvoiceData>[]} Invoice table columns
 */
const _getColumns = (props: InvoiceProps): TableColumn<InvoiceData>[] => {
  /**
   * Render row number with current pagination.
   * @param {InvoiceData} row - Invoice row
   * @param {number} index - Zero-based index
   * @returns {React.ReactElement} Row number element
   */
  const renderRowNumber = (row: InvoiceData, index: number): React.ReactElement => _renderRowNumber(row, index, props);

  /**
   * Render row actions with current handlers.
   * @param {InvoiceData} row - Invoice row
   * @returns {React.ReactElement} Row actions element
   */
  const renderActions = (row: InvoiceData): React.ReactElement => _renderActions(row, props);

  return [
    { key: "no", header: "No", align: "center", render: renderRowNumber },
    { key: "invoiceNumber", header: "Invoice No", render: _renderInvoiceNumber },
    { key: "customerName", header: "Customer Name", render: _renderCustomerName },
    { key: "name", header: "Event Name", render: _renderEventName },
    { key: "invoiceDate", header: "Invoice Date", render: _renderInvoiceDate },
    { key: "startDate", header: "Event Start Date", render: _renderStartDate },
    { key: "endDate", header: "Event End Date", render: _renderEndDate },
    { key: "status", header: "Status", align: "center", render: _renderStatus },
    { key: "actions", header: "Action", align: "center", render: renderActions },
  ];
};

/**
 * Render loading, empty, and error state messages.
 * @param {InvoiceProps} props - Invoice component props
 * @returns {React.ReactElement | null} State message element
 */
const _renderListState = (props: InvoiceProps): React.ReactElement | null => {
  if (props.errorMessage) return <p className="py-10 text-center text-lg text-danger">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-lg text-text-secondary">No invoices found.</p>;

  return null;
};

/**
 * Render action cell skeleton.
 * @returns {React.ReactElement} Skeleton action cell
 */
const _renderActionSkeleton = (): React.ReactElement => (
  <div className="flex justify-center gap-1">
    <span className="h-10 w-10 rounded-3xl bg-background-subtle" />
    <span className="h-10 w-10 rounded-3xl bg-background-subtle" />
    <span className="h-10 w-10 rounded-3xl bg-background-subtle" />
  </div>
);

/**
 * Render invoice table skeleton matching the loaded table columns.
 * @param {InvoiceProps} props - Invoice table props
 * @returns {React.ReactElement} Invoice table skeleton
 */
const _renderInvoiceTableSkeleton = (props: InvoiceProps): React.ReactElement => {
  const columns = _getColumns(props);
  const widths = ["w-6", "w-28", "w-32", "w-36", "w-24", "w-24", "w-24"];

  return (
    <div className="w-full overflow-x-auto" role="status" aria-label="Loading invoice table">
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
                    _renderActionSkeleton()
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
 * Render invoice mobile card skeleton matching final card content.
 * @param {number} key - Skeleton key
 * @returns {React.ReactElement} Invoice mobile card skeleton
 */
const _renderInvoiceCardSkeleton = (key: number): React.ReactElement => (
  <div key={key} className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small" role="status" aria-label="Loading invoice card">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="h-7 w-28 rounded-3xl bg-background-subtle" />
      <div className="h-8 w-32 rounded-full bg-background-subtle" />
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
 * Render desktop table view.
 * @param {InvoiceProps} props - Invoice props
 * @returns {React.ReactElement} Desktop table section
 */
const _renderTable = (props: InvoiceProps): React.ReactElement => {
  /**
   * Handle search input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search input change event
   * @returns {void} No return value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
        <SearchFilter placeholder="Search invoice" onChange={handleSearch} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" />
      </div>
      <div className="flex-1 overflow-auto">
        {props.isLoading ? _renderInvoiceTableSkeleton(props) : _renderListState(props) ?? <Table data={props.paginatedData} columns={_getColumns(props)} isDetail={false} onRowClick={props.onRowClick} keyExtractor={(row: InvoiceData): string => row.id} />}
      </div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} className="pt-4" />
    </div>
  );
};

/**
 * Render mobile cards view.
 * @param {InvoiceProps} props - Invoice props
 * @returns {React.ReactElement} Mobile list section
 */
const _renderMobile = (props: InvoiceProps): React.ReactElement => {
  /**
   * Handle search input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search input change event
   * @returns {void} No return value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter placeholder="Search invoice" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="!h-16 text-xl placeholder:text-xl" />
      <div className="flex min-w-0 flex-col gap-4">
        {props.isLoading ? (
          Array.from({ length: 5 }, (_value, index) => _renderInvoiceCardSkeleton(index))
        ) : _renderListState(props) ?? props.paginatedData.map((invoice) => (
          <InvoiceMobileCard key={invoice.id} invoice={invoice} onClick={props.onRowClick} />
        ))}
      </div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs" />
    </div>
  );
};

/**
 * Render invoice list page.
 * @param {InvoiceProps} props - Invoice component props
 * @returns {React.ReactElement} Invoice page
 */
export const InvoiceComponent = (props: InvoiceProps): React.ReactElement => (
  <Layout pageTitle="Invoice List">
    <PageLayout title="Invoice List" subtitle="Manage invoices and payment status" breadcrumbs={["Document", "Invoice"]} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}>
      <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
        {_renderMobile(props)}
        {_renderTable(props)}
      </div>
    </PageLayout>
  </Layout>
);
