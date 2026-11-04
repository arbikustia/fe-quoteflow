import * as React from "react";
import { FiDownload, FiEdit2, FiEye } from "react-icons/fi";

import { generateQuotationPDF } from "@/utils/pdfGenerator";

import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import { getQuotationStatusLabel, getStatusBadgeClass } from "./detail/QuotationDetail.helpers";
import { getQuotationRowNumber, QuotationMobileCard, quotationToQuoteData } from "./Quotation.helpers";
import type { QuotationData, QuotationProps } from "./Quotation.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

/**
 * Render row number cell.
 * @param {QuotationData} _row - quotation row.
 * @param {number} index - zero-based row index.
 * @param {QuotationProps} props - quotation state.
 * @returns {React.ReactElement} row number.
 */
const _renderRowNumber = (_row: QuotationData, index: number, props: QuotationProps): React.ReactElement => (
  <span className="text-lg">{getQuotationRowNumber(props.currentPage, props.pageSize, index)}</span>
);

/**
 * Render quotation download action.
 * @param {QuotationData} row - quotation row.
 * @returns {React.ReactElement} Download action.
 */
const _renderDownloadAction = (row: QuotationData): React.ReactElement => (
  <button
    type="button"
    onClick={(event: React.MouseEvent): void => {
      event.stopPropagation();
      void generateQuotationPDF(quotationToQuoteData(row));
    }}
    className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
    title="Download PDF"
    aria-label="Download PDF"
  >
    <FiDownload className="h-5 w-5" />
  </button>
);

/**
 * Render quotation detail action.
 * @param {QuotationData} row - quotation row.
 * @param {QuotationProps} props - quotation state and handlers.
 * @returns {React.ReactElement} Detail action.
 */
const _renderDetailAction = (row: QuotationData, props: QuotationProps): React.ReactElement => (
  <button
    type="button"
    onClick={(event: React.MouseEvent): void => {
      event.stopPropagation();
      props.onDetail(row);
    }}
    className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
    title="View quotation detail"
    aria-label="View quotation detail"
  >
    <FiEye className="h-5 w-5" />
  </button>
);

/**
 * Render quotation status action.
 * @param {QuotationData} row - quotation row.
 * @param {QuotationProps} props - quotation state and handlers.
 * @returns {React.ReactElement} Status action.
 */
const _renderStatusAction = (row: QuotationData, props: QuotationProps): React.ReactElement => (
  <button
    type="button"
    onClick={(event: React.MouseEvent): void => {
      event.stopPropagation();
      props.onEdit(row);
    }}
    className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
    title="Edit quotation"
    aria-label="Edit quotation"
  >
    <FiEdit2 className="h-5 w-5" />
  </button>
);

/**
 * Render quotation status cell.
 * @param {QuotationData} row - quotation row.
 * @returns {React.ReactElement} Status badge.
 */
const _renderStatus = (row: QuotationData): React.ReactElement => (
  <span className={`inline-flex rounded-full px-4 py-1.5 text-lg font-semibold ${getStatusBadgeClass(row.status)}`}>
    {getQuotationStatusLabel(row.status)}
  </span>
);

/**
 * Render action cells.
 * @param {QuotationData} row - quotation row.
 * @param {QuotationProps} props - quotation state and handlers.
 * @returns {React.ReactElement} row actions.
 */
const _renderActions = (row: QuotationData, props: QuotationProps): React.ReactElement => (
  <div className="flex items-center justify-center gap-1">
    {_renderDownloadAction(row)}
    {_renderDetailAction(row, props)}
    {_renderStatusAction(row, props)}
  </div>
);

/**
 * Render quotation number cell.
 * @param {QuotationData} row - Quotation row
 * @returns {React.ReactElement} Quotation number element
 */
const _renderQuotationNumber = (row: QuotationData): React.ReactElement => (
  <span className="text-lg font-medium">{row.quotationNumber}</span>
);

/**
 * Render customer name cell.
 * @param {QuotationData} row - Quotation row
 * @returns {React.ReactElement} Customer name element
 */
const _renderCustomerName = (row: QuotationData): React.ReactElement => (
  <span className="text-lg">{row.customerName}</span>
);

/**
 * Render event name cell.
 * @param {QuotationData} row - Quotation row
 * @returns {React.ReactElement} Event name element
 */
const _renderEventName = (row: QuotationData): React.ReactElement => (
  <span className="text-lg">{row.name}</span>
);

/**
 * Render quotation date cell.
 * @param {QuotationData} row - Quotation row
 * @returns {React.ReactElement} Quotation date element
 */
const _renderQuotationDate = (row: QuotationData): React.ReactElement => (
  <span className="text-lg">{row.quotationDate}</span>
);

/**
 * Render event start date cell.
 * @param {QuotationData} row - Quotation row
 * @returns {React.ReactElement} Start date element
 */
const _renderStartDate = (row: QuotationData): React.ReactElement => (
  <span className="text-lg">{row.startDate}</span>
);

/**
 * Render event end date cell.
 * @param {QuotationData} row - Quotation row
 * @returns {React.ReactElement} End date element
 */
const _renderEndDate = (row: QuotationData): React.ReactElement => (
  <span className="text-lg">{row.endDate}</span>
);

/**
 * Build quotation table columns.
 * @param {QuotationProps} props - quotation state and handlers.
 * @returns {TableColumn<QuotationData>[]} quotation columns.
 */
const _getColumns = (props: QuotationProps): TableColumn<QuotationData>[] => {
  /**
   * Render row number with current pagination.
   * @param {QuotationData} row - quotation row.
   * @param {number} index - zero-based row index.
   * @returns {React.ReactElement} row number.
   */
  const renderRowNumber = (row: QuotationData, index: number): React.ReactElement => _renderRowNumber(row, index, props);

  /**
   * Render row actions with current handlers.
   * @param {QuotationData} row - quotation row.
   * @returns {React.ReactElement} row actions.
   */
  const renderActions = (row: QuotationData): React.ReactElement => _renderActions(row, props);

  return [
    { key: "no", header: "No", align: "center", render: renderRowNumber },
    { key: "quotationNumber", header: "Quotation No", render: _renderQuotationNumber },
    { key: "customerName", header: "Customer Name", render: _renderCustomerName },
    { key: "name", header: "Event Name", render: _renderEventName },
    { key: "quotationDate", header: "Quotation Date", render: _renderQuotationDate },
    { key: "startDate", header: "Event Start Date", render: _renderStartDate },
    { key: "endDate", header: "Event End Date", render: _renderEndDate },
    { key: "status", header: "Status", align: "center", render: _renderStatus },
    { key: "actions", header: "Action", align: "center", render: renderActions },
  ];
};

/**
 * Render loading, empty, and error state messages.
 * @param {QuotationProps} props - props value.
 * @returns {React.ReactElement | null} - result.
 */
const _renderListState = (props: QuotationProps): React.ReactElement | null => {
  if (props.isMissingData) return <p className="py-10 text-center text-lg text-danger">Quotation data is unavailable. Please try again.</p>;

  if (props.errorMessage) return <p className="py-10 text-center text-lg text-danger">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-lg text-text-secondary">No quotations found.</p>;

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
 * Render quotation table skeleton with the same columns and cells as the loaded table.
 * @param {QuotationProps} props - Quotation table props
 * @returns {React.ReactElement} Quotation table skeleton
 */
const _renderTableSkeleton = (props: QuotationProps): React.ReactElement => {
  const columns = _getColumns(props);
  const widths = ["w-6", "w-28", "w-32", "w-36", "w-24", "w-24", "w-24"];

  return (
    <div className="w-full overflow-x-auto" role="status" aria-label="Loading quotation table">
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
 * Render quotation mobile card skeleton using final card spacing.
 * @param {number} key - Skeleton key
 * @returns {React.ReactElement} Quotation mobile card skeleton
 */
const _renderMobileCardSkeleton = (key: number): React.ReactElement => (
  <div key={key} className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small" role="status" aria-label="Loading quotation card">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="h-7 w-28 rounded-3xl bg-background-subtle" />
      <div className="h-8 w-32 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 h-7 w-4/5 rounded-3xl bg-background-subtle" />
    <div className="mt-1.5 h-7 w-3/5 rounded-3xl bg-background-subtle" />
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <div className="min-w-0"><div className="h-7 w-20 rounded-3xl bg-background-subtle" /><div className="mt-1 h-7 w-40 rounded-3xl bg-background-subtle" /></div>
      <div className="text-right"><div className="ml-auto h-7 w-12 rounded-3xl bg-background-subtle" /><div className="mt-1 h-7 w-28 rounded-3xl bg-background-subtle" /></div>
    </div>
  </div>
);

/**
 * Render desktop table view.
 * @param {QuotationProps} props - Quotation state and handlers
 * @returns {React.ReactElement} Desktop table section
 */
const _renderTable = (props: QuotationProps): React.ReactElement => {
  /**
   * Handle search input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search input change event
   * @returns {void} No return value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
        <SearchFilter placeholder="Search quotation" onChange={handleSearch} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" />
      </div>
      <div className="flex-1 overflow-auto">
        {props.isLoading ? _renderTableSkeleton(props) : _renderListState(props) ?? <Table data={props.paginatedData} columns={_getColumns(props)} isDetail={false} onRowClick={props.onRowClick} keyExtractor={(row: QuotationData): string => row.id} />}
      </div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} className="pt-4" />
    </div>
  );
};

/**
 * Render mobile cards view.
 * @param {QuotationProps} props - Quotation state and handlers
 * @returns {React.ReactElement} Mobile list section
 */
const _renderMobile = (props: QuotationProps): React.ReactElement => {
  /**
   * Handle search input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search input change event
   * @returns {void} No return value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter placeholder="Search quotation" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="!h-16 text-xl placeholder:text-xl" />
      <div className="flex min-w-0 flex-col gap-4">
        {props.isLoading ? (
          Array.from({ length: 5 }, (_value, index) => _renderMobileCardSkeleton(index))
        ) : _renderListState(props) ?? props.paginatedData.map((quotation) => (
          <QuotationMobileCard key={quotation.id} quotation={quotation} onClick={props.onRowClick} />
        ))}
      </div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs" />
    </div>
  );
};

/**
 * QuotationComponent.
 * @param {QuotationProps} props - props value.
 * @returns {React.ReactElement} - result.
 */
export const QuotationComponent = (props: QuotationProps): React.ReactElement => (
  <Layout pageTitle="Quotation List">
    <PageLayout title="Quotation List" subtitle="Manage quotation documents and status" breadcrumbs={["Document", "Quotation"]} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}>
      <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
        {_renderMobile(props)}
        {_renderTable(props)}
      </div>
    </PageLayout>
  </Layout>
);
