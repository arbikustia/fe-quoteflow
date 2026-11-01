import * as React from "react";
import { FiDownload } from "react-icons/fi";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";
import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import { SkeletonComponent } from "@/components/Skeleton";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";
import { generateQuotePDF } from "@/utils/pdfGenerator";

import { getOrderRowNumber, OrderMobileCard, toQuoteData } from "./Report.helpers";
import type { ReportOrderData, ReportOrderProps } from "./Report.type";

/**
 * Render order status cell.
 * @param {ReportOrderData} row - Report order row data
 * @returns {React.ReactElement} Status cell
 */
const _renderStatus = (row: ReportOrderData): React.ReactElement => (
  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${row.status === 1 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
    {row.statusLabel}
  </span>
);

/**
 * Render order action cell.
 * @param {ReportOrderData} row - Report order row data
 * @returns {React.ReactElement} Action cell
 */
const _renderActions = (row: ReportOrderData): React.ReactElement => {
  /**
   * Handle download PDF.
   * @param {React.MouseEvent} event - Mouse event
   * @returns {void}
   */
  const handleDownload = (event: React.MouseEvent): void => {
    event.stopPropagation();
    void generateQuotePDF(toQuoteData(row));
  };

  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        onClick={handleDownload}
        className="cursor-pointer rounded-lg p-1.5 text-brand-text-medium transition-colors hover:bg-brand-blue-light hover:text-brand-blue"
        title="Download PDF"
      >
        <FiDownload className="h-4 w-4" />
      </button>
    </div>
  );
};

/**
 * Render order row number cell.
 * @param {ReportOrderData} _row - Report order row data
 * @param {number} index - Zero-based row index
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @returns {React.ReactElement} Number cell
 */
const _renderNumber = (_row: ReportOrderData, index: number, currentPage: number, pageSize: number): React.ReactElement => (
  <span className="text-sm">{getOrderRowNumber(currentPage, pageSize, index)}</span>
);

/**
 * Build report table columns.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @returns {TableColumn<ReportOrderData>[]} Report order columns
 */
const _getColumns = (currentPage: number, pageSize: number): TableColumn<ReportOrderData>[] => {
  /**
   * Render order number.
   * @param {ReportOrderData} row - Row data
   * @param {number} index - Row index
   * @returns {React.ReactElement} Number cell
   */
  const renderNumber = (row: ReportOrderData, index: number): React.ReactElement => _renderNumber(row, index, currentPage, pageSize);

  return [
    { key: "no", header: "No", align: "center", render: renderNumber },
    { key: "orderNo", header: "Order No" },
    { key: "customerName", header: "Customer Name" },
    { key: "eventName", header: "Event Name" },
    { key: "address", header: "Location" },
    { key: "startDate", header: "Start Date" },
    { key: "endDate", header: "End Date" },
    { key: "status", header: "Status", align: "center", render: _renderStatus },
    { key: "actions", header: "Action", align: "center", render: _renderActions },
  ];
};

/**
 * Render loading, empty, and error states.
 * @param {ReportOrderProps} props - The component props
 * @returns {React.ReactElement | null} The state element when no rows should render
 */
const _renderListState = (props: ReportOrderProps): React.ReactElement | null => {
  const { isLoading, errorMessage, isEmpty, isMissingData } = props;

  if (isLoading) return <p className="py-10 text-center text-sm text-brand-text-medium">Loading orders…</p>;

  if (isMissingData) return <p className="py-10 text-center text-sm text-red-600">Order data is unavailable. Please try again.</p>;

  if (errorMessage) return <p className="py-10 text-center text-sm text-red-600">{errorMessage}</p>;

  if (isEmpty) return <p className="py-10 text-center text-sm text-brand-text-medium">No orders found.</p>;

  return null;
};

/**
 * Render desktop table view.
 * @param {ReportOrderProps} props - Component props
 * @returns {React.ReactElement} Desktop table element
 */
const _renderDesktopTable = (props: ReportOrderProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, goToPage, pageSize, changePageSize, onRowClick, setSearchTerm, totalCount } = props;
  const columns = _getColumns(currentPage, pageSize);

  /**
   * Handle search input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Change event
   * @returns {void}
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="hidden rounded-4xl border border-border-default bg-background-surface px-6 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 py-6 border-brand-gray-light">
        <SearchFilter placeholder="Search order" onChange={handleSearchChange} />
      </div>
      <div className="flex-1 overflow-auto">
        {props.isLoading ? (
          <SkeletonComponent rows={5} columns={[{ width: "6%" }, { width: "14%" }, { width: "16%" }, { width: "16%" }, { width: "16%" }, { width: "12%" }, { width: "12%" }, { width: "8%" }]} />
        ) : _renderListState(props) ?? <Table data={paginatedData} columns={columns} isDetail={false} onRowClick={onRowClick} keyExtractor={(r: ReportOrderData) => r.id} />}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} onPageChange={goToPage} onPageSizeChange={changePageSize} totalItems={totalCount} />
    </div>
  );
};

/**
 * Render mobile search.
 * @param {ReportOrderProps["setSearchTerm"]} setSearchTerm - Search callback
 * @returns {React.ReactElement} Search field
 */
const _renderMobileSearch = (setSearchTerm: ReportOrderProps["setSearchTerm"]): React.ReactElement => {
  /**
   * Handle mobile search input.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search change event
   * @returns {void}
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return <SearchFilter placeholder="Search order" onChange={handleSearchChange} isRoundedFull={true} className="w-full sm:w-full" inputClassName="text-lg placeholder:text-lg" />;
};

/**
 * Render mobile order cards list view.
 * @param {ReportOrderProps} props - Component props
 * @returns {React.ReactElement} Mobile list element
 */
const _renderMobileCards = (props: ReportOrderProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, goToPage, pageSize, changePageSize, setSearchTerm, totalCount, onRowClick } = props;

  return (
    <div className="lg:hidden flex min-w-0 flex-col gap-4 pt-2 pb-16">
      <div className="w-full">{_renderMobileSearch(setSearchTerm)}</div>
      <div className="min-w-0 space-y-3">
        {_renderListState(props) ?? paginatedData.map((order) => (
          <OrderMobileCard key={order.id} order={order} onRowClick={onRowClick} />
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
 * Report Order Component.
 * @param {ReportOrderProps} props - Component props
 * @returns {React.ReactElement} Report Order component
 */
export const ReportOrderComponent = (props: ReportOrderProps): React.ReactElement => {
  const { onBack } = props;

  return (
    <Layout pageTitle="Order" mobileWhiteBackground={true}>
      <PageLayout
        title="Order"
        breadcrumbs={["Report", "Order"]}
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

export default ReportOrderComponent;
