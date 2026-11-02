import * as React from "react";
import { FiDownload, FiEdit2 } from "react-icons/fi";

import { generateInvoicePDF } from "@/utils/pdfGenerator";

import { MasterDataCard } from "@/components/MasterDataCard";
import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import Table, { type TableColumn } from "@/components/Table";

import { invoiceToQuoteData } from "./Invoice.helpers";
import type { InvoiceData, InvoiceProps } from "./Invoice.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

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
    className="cursor-pointer rounded-lg p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
    title="Download PDF"
    aria-label="Download PDF"
  >
    <FiDownload className="h-5 w-5" />
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
    className="cursor-pointer rounded-lg p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
    title="Edit invoice"
    aria-label="Edit invoice"
  >
    <FiEdit2 className="h-5 w-5" />
  </button>
);

/**
 * Render action cells.
 * @param {InvoiceData} row - Invoice row
 * @param {InvoiceProps} props - Invoice props
 * @returns {React.ReactElement} Row actions
 */
const _renderActions = (row: InvoiceData, props: InvoiceProps): React.ReactElement => (
  <div className="flex items-center justify-center gap-1">
    {_renderDownloadAction(row)}
    {_renderEditAction(row, props)}
  </div>
);

/**
 * Build invoice table columns using quotation list fields and invoice dates.
 * @param {InvoiceProps} props - Invoice component props
 * @returns {TableColumn<InvoiceData>[]} Invoice table columns
 */
const _getColumns = (props: InvoiceProps): TableColumn<InvoiceData>[] => [
  {
    key: "no",
    header: "No",
    align: "center",
    /**
     * Render row number.
     * @param {InvoiceData} _row - Invoice row
     * @param {number} index - Row index
     * @returns {React.ReactElement} Row number
     */
    render: (_row: InvoiceData, index: number): React.ReactElement => <span>{(props.currentPage - 1) * props.pageSize + index + 1}</span>,
  },
  { key: "invoiceNumber", header: "Invoice No" },
  { key: "customerName", header: "Customer Name" },
  { key: "name", header: "Event Name" },
  { key: "invoiceDate", header: "Invoice Date" },
  { key: "dueDate", header: "Due Date" },
  { key: "startDate", header: "Event Start Date" },
  { key: "endDate", header: "Event End Date" },
  {
    key: "actions",
    header: "Action",
    align: "center",
    /**
     * Render invoice actions.
     * @param {InvoiceData} row - Invoice row
     * @returns {React.ReactElement} Invoice actions
     */
    render: (row: InvoiceData): React.ReactElement => _renderActions(row, props),
  },
];

/**
 * Render invoice mobile card.
 * @param {InvoiceData} invoice - Invoice data
 * @param {InvoiceProps["onRowClick"]} onRowClick - Detail callback
 * @returns {React.ReactElement} Invoice card
 */
const _renderMobileCard = (invoice: InvoiceData, onRowClick: InvoiceProps["onRowClick"]): React.ReactElement => {
  /**
   * Open invoice detail.
   * @returns {void} No return value
   */
  const handleClick = (): void => onRowClick(invoice);

  return (
    <MasterDataCard title={invoice.invoiceNumber} status={invoice.status === 0 ? "inactive" : "active"} isLargeText={true} onClick={handleClick}>
      <span className="grid gap-1 text-lg text-text-secondary">
        <span className="truncate">{invoice.customerName}</span>
        <span className="truncate">{invoice.name}</span>
        <span className="truncate">{invoice.startDate} - {invoice.endDate}</span>
      </span>
    </MasterDataCard>
  );
};

/**
 * Render invoice table skeleton matching real columns.
 * @returns {React.ReactElement} Invoice table skeleton
 */
const _renderInvoiceTableSkeleton = (): React.ReactElement => {
  const columns = ["7%", "13%", "14%", "14%", "11%", "11%", "13%", "13%", "7%"];

  return (
    <div className="min-w-225 animate-pulse overflow-hidden" role="status" aria-label="Loading invoice table">
      <div className="flex h-12 items-center gap-4 border-b border-border-default bg-background-subtle px-4">{columns.map((width, index) => <div key={`invoice-table-header-${index}`} className="h-4 rounded bg-background-muted" style={{ width }} />)}</div>
      {Array.from({ length: 5 }, (_value, rowIndex) => <div key={`invoice-table-row-${rowIndex}`} className="flex h-14 items-center gap-4 border-b border-border-default px-4">{columns.map((width, columnIndex) => <div key={`invoice-table-cell-${rowIndex}-${columnIndex}`} className="h-4 rounded bg-background-subtle" style={{ width }} />)}</div>)}
    </div>
  );
};

/**
 * Render invoice mobile card skeleton matching MasterDataCard.
 * @param {number} key - Skeleton key
 * @returns {React.ReactElement} Invoice mobile card skeleton
 */
const _renderInvoiceCardSkeleton = (key: number): React.ReactElement => (
  <div key={key} className="animate-pulse rounded-2xl border border-border-default bg-background-surface p-5" role="status" aria-label="Loading invoice card">
    <div className="flex items-start justify-between gap-4"><div className="h-7 w-2/5 rounded bg-background-subtle" /><div className="h-6 w-16 rounded-full bg-background-subtle" /></div>
    <div className="mt-3 grid gap-2"><div className="h-5 w-3/5 rounded bg-background-subtle" /><div className="h-5 w-4/5 rounded bg-background-subtle" /><div className="h-5 w-2/3 rounded bg-background-subtle" /></div>
  </div>
);

/**
 * Render invoice list content.
 * @param {InvoiceProps} props - Invoice component props
 * @returns {React.ReactElement} Invoice content
 */
const _renderContent = (props: InvoiceProps): React.ReactElement => {
  const columns = _getColumns(props);

  if (props.isLoading) return _renderInvoiceTableSkeleton();

  if (props.errorMessage) return <p className="py-10 text-center text-sm text-danger">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-sm text-text-secondary">No invoices found.</p>;

  return <Table data={props.paginatedData} columns={columns} isDetail={false} onRowClick={props.onRowClick} keyExtractor={(row: InvoiceData): string => row.id} />;
};

/**
 * Render mobile invoice content.
 * @param {InvoiceProps} props - Invoice component props
 * @returns {React.ReactElement} Mobile invoice content
 */
const _renderMobileContent = (props: InvoiceProps): React.ReactElement => {
  if (props.isLoading) return <>{Array.from({ length: 5 }, (_value, index) => _renderInvoiceCardSkeleton(index))}</>;

  if (props.errorMessage) return <p className="py-10 text-center text-sm text-danger">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-sm text-text-secondary">No invoices found.</p>;

  return <>{props.paginatedData.map((invoice) => _renderMobileCard(invoice, props.onRowClick))}</>;
};

/**
 * Render invoice list page.
 * @param {InvoiceProps} props - Invoice component props
 * @returns {React.ReactElement} Invoice page
 */
export const InvoiceComponent = (props: InvoiceProps): React.ReactElement => {
  /**
   * Update invoice search term.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search event
   * @returns {void} No return value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <Layout pageTitle="Invoice List" mobileWhiteBackground={true}>
      <PageLayout title="Invoice List" subtitle="Manage invoices and payment status" breadcrumbs={["Document", "Invoice"]} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}>
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:pb-0">
          <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
            <SearchFilter placeholder="Search invoice" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="!h-16 text-xl placeholder:text-xl" />
            <div className="min-w-0 space-y-3">
              {_renderMobileContent(props)}
            </div>
            <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" />
          </div>
          <div className="hidden rounded-4xl border border-border-default bg-background-surface px-6 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
            <div className="flex items-center py-6"><SearchFilter placeholder="Search invoice" onChange={handleSearch} /></div>
            <div className="flex-1 overflow-auto">{_renderContent(props)}</div>
            <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} />
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
};
