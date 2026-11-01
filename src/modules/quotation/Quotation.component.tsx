import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
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
    className="cursor-pointer rounded-lg p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
    title="Edit quotation"
    aria-label="Edit quotation"
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
 * Render quotation table skeleton using final table column proportions.
 * @returns {React.ReactElement} Quotation table skeleton
 */
const _renderTableSkeleton = (): React.ReactElement => {
  const columns = ["8%", "15%", "15%", "18%", "12%", "12%", "12%", "8%"];

  return (
    <div className="min-w-225 animate-pulse overflow-hidden" role="status" aria-label="Loading quotation table">
      <div className="flex h-12 items-center gap-4 border-b border-border-default bg-background-subtle px-4">
        {columns.map((width, index) => <div key={`quotation-table-header-${index}`} className="h-4 rounded bg-background-muted" style={{ width }} />)}
      </div>
      {Array.from({ length: 5 }, (_value, rowIndex) => (
        <div key={`quotation-table-row-${rowIndex}`} className="flex h-14 items-center gap-4 border-b border-border-default px-4">
          {columns.map((width, columnIndex) => <div key={`quotation-table-cell-${rowIndex}-${columnIndex}`} className="h-4 rounded bg-background-subtle" style={{ width }} />)}
        </div>
      ))}
    </div>
  );
};

/**
 * Render quotation mobile card skeleton using final card spacing.
 * @param {number} key - Skeleton key
 * @returns {React.ReactElement} Quotation mobile card skeleton
 */
const _renderMobileCardSkeleton = (key: number): React.ReactElement => (
  <div key={key} className="animate-pulse rounded-2xl border border-border-default bg-background-surface p-5" role="status" aria-label="Loading quotation card">
    <div className="flex items-start justify-between gap-4">
      <div className="h-7 w-2/5 rounded bg-background-subtle" />
      <div className="h-6 w-16 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-3 grid gap-2">
      <div className="h-5 w-3/5 rounded bg-background-subtle" />
      <div className="h-5 w-4/5 rounded bg-background-subtle" />
      <div className="h-5 w-2/3 rounded bg-background-subtle" />
    </div>
  </div>
);

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
        {props.isLoading ? _renderTableSkeleton() : _renderListState(props) ?? <Table data={props.paginatedData} columns={_getColumns(props)} isDetail={false} onRowClick={props.onRowClick} keyExtractor={(row: QuotationData): string => row.id} />}
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
    <div className="lg:hidden flex min-w-0 flex-col gap-4 pt-2 pb-16">
      <SearchFilter placeholder="Search quotation" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="!h-16 text-xl placeholder:text-xl" />
      <div className="min-w-0 space-y-3">
        {props.isLoading ? (
          Array.from({ length: 5 }, (_value, index) => _renderMobileCardSkeleton(index))
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
    <PageLayout title="Quotation List" subtitle="Manage quotation documents and status" breadcrumbs={["Document", "Quotation"]} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}>
      <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
        {_renderMobile(props)}
        {_renderTable(props)}
      </div>
    </PageLayout>
  </Layout>
);
