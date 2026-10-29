import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import { SkeletonComponent } from "@/components/Skeleton";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import { getQuotationRowNumber, QuotationMobileCard } from "./Quotation.helpers";
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
  <span>{getQuotationRowNumber(props.currentPage, props.pageSize, index)}</span>
);

/**
 * Render status cell.
 * @param {QuotationData} row - quotation row.
 * @returns {React.ReactElement} Status label.
 */
const _renderStatus = (row: QuotationData): React.ReactElement => (
  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${row.status === 1 ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
    {row.status === 1 ? "Active" : "Inactive"}
  </span>
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
      props.onStatus(row);
    }}
    className="cursor-pointer rounded-lg p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
    title="Update status"
    aria-label="Update status"
  >
    <FiEdit2 className="h-5 w-5" />
  </button>
);

/**
 * Render action cells.
 * @param {QuotationData} row - quotation row.
 * @param {QuotationProps} props - quotation state and handlers.
 * @returns {React.ReactElement} row actions.
 */
const _renderActions = (row: QuotationData, props: QuotationProps): React.ReactElement => (
  <div className="flex items-center justify-center">
    {_renderStatusAction(row, props)}
  </div>
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
   * Render row status with current state.
   * @param {QuotationData} row - quotation row.
   * @returns {React.ReactElement} status switch.
   */
  const renderStatus = (row: QuotationData): React.ReactElement => _renderStatus(row);
  /**
   * Render row actions with current handlers.
   * @param {QuotationData} row - quotation row.
   * @returns {React.ReactElement} row actions.
   */
  const renderActions = (row: QuotationData): React.ReactElement => _renderActions(row, props);

  return [
    { key: "no", header: "No", align: "center", render: renderRowNumber },
    { key: "quotationNumber", header: "Quotation No" },
    { key: "customerName", header: "Customer Name" },
    { key: "name", header: "Event Name" },
    { key: "quotationDate", header: "Quotation Date" },
    { key: "startDate", header: "Event Start Date" },
    { key: "endDate", header: "Event End Date" },
    { key: "status", header: "Status", align: "center", render: renderStatus },
    { key: "actions", header: "Action", align: "center", render: renderActions },
  ];
};

/**
 * _renderListState.
 * @param {QuotationProps} props - props value.
 * @returns {React.ReactElement | null} - result.
 */
const _renderListState = (props: QuotationProps): React.ReactElement | null => {
  if (props.isMissingData) return <p className="py-10 text-center text-sm text-danger">Quotation data is unavailable. Please try again.</p>;

  if (props.errorMessage) return <p className="py-10 text-center text-sm text-danger">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-sm text-text-secondary">No quotations found.</p>;

  return null;
};

/**
 * _renderTable.
 * @param {QuotationProps} props - props value.
 * @returns {React.ReactElement} - result.
 */
const _renderTable = (props: QuotationProps): React.ReactElement => {
  /**
 * handleSearch.
 * @param {React.ChangeEvent<HTMLInputElement>} event - event value.
 * @returns {void} - result.
 */
const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="hidden rounded-4xl border border-border-default bg-background-surface px-6 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 border-brand-gray-light py-6">
        <SearchFilter placeholder="Search quotation" onChange={handleSearch} />
      </div>
      <div className="flex-1 overflow-auto">
        {props.isLoading ? <SkeletonComponent rows={5} columns={[{ width: "8%" }, { width: "15%" }, { width: "15%" }, { width: "18%" }, { width: "12%" }, { width: "12%" }, { width: "12%" }, { width: "8%" }]} /> : _renderListState(props) ?? <Table data={props.paginatedData} columns={_getColumns(props)} isDetail={true} onRowClick={props.onRowClick} keyExtractor={(row: QuotationData): string => row.id} />}
      </div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} />
    </div>
  );
};

/**
 * _renderMobile.
 * @param {QuotationProps} props - props value.
 * @returns {React.ReactElement} - result.
 */
const _renderMobile = (props: QuotationProps): React.ReactElement => {
  /**
 * handleSearch.
 * @param {React.ChangeEvent<HTMLInputElement>} event - event value.
 * @returns {void} - result.
 */
const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter placeholder="Search quotation" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="text-lg placeholder:text-lg" />
      <div className="min-w-0 space-y-3">
        {props.isLoading ? (
          <SkeletonComponent rows={5} columns={[{ width: "100%" }]} />
        ) : _renderListState(props) ?? props.paginatedData.map((quotation) => (
          <QuotationMobileCard key={quotation.id} quotation={quotation} onClick={props.onRowClick} />
        ))}
      </div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" />
    </div>
  );
};

/**
 * QuotationComponent.
 * @param {QuotationProps} props - props value.
 * @returns {React.ReactElement} - result.
 */
export const QuotationComponent = (props: QuotationProps): React.ReactElement => (
  <Layout pageTitle="Quotation List" mobileWhiteBackground={true}>
    <PageLayout title="Quotation List" breadcrumbs={["Document", "Quotation"]} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}>
      <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
        {_renderMobile(props)}
        {_renderTable(props)}
      </div>
    </PageLayout>
  </Layout>
);
