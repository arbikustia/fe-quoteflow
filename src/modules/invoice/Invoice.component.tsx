import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import { MasterDataCard } from "@/components/MasterDataCard";
import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import { SkeletonComponent } from "@/components/Skeleton";
import Table, { type TableColumn } from "@/components/Table";

import type { InvoiceData, InvoiceProps } from "./Invoice.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

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
  <div className="flex items-center justify-center">
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
    key: "status",
    header: "Status",
    align: "center",
    /**
     * Render invoice status.
     * @param {InvoiceData} row - Invoice row
     * @returns {React.ReactElement} Invoice status
     */
    render: (row: InvoiceData): React.ReactElement => (
      <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${row.status === 1 ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
        {row.status === 1 ? "Active" : "Inactive"}
      </span>
    ),
  },
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
    <MasterDataCard title={invoice.invoiceNumber} status={invoice.status === 1 ? "active" : "inactive"} isLargeText={true} onClick={handleClick}>
      <span className="grid gap-1 text-lg text-text-secondary">
        <span className="truncate">{invoice.customerName}</span>
        <span className="truncate">{invoice.name}</span>
        <span className="truncate">{invoice.startDate} - {invoice.endDate}</span>
      </span>
    </MasterDataCard>
  );
};

/**
 * Render invoice list content.
 * @param {InvoiceProps} props - Invoice component props
 * @returns {React.ReactElement} Invoice content
 */
const _renderContent = (props: InvoiceProps): React.ReactElement => {
  const columns = _getColumns(props);

  if (props.isLoading) return <SkeletonComponent rows={5} columns={columns.map(() => ({ width: "10%" }))} />;

  if (props.errorMessage) return <p className="py-10 text-center text-sm text-danger">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-sm text-text-secondary">No invoices found.</p>;

  return <Table data={props.paginatedData} columns={columns} isDetail={true} onRowClick={props.onRowClick} keyExtractor={(row: InvoiceData): string => row.id} />;
};

/**
 * Render mobile invoice content.
 * @param {InvoiceProps} props - Invoice component props
 * @returns {React.ReactElement} Mobile invoice content
 */
const _renderMobileContent = (props: InvoiceProps): React.ReactElement => {
  if (props.isLoading) return <SkeletonComponent rows={5} columns={[{ width: "100%" }]} />;

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
      <PageLayout title="Invoice List" breadcrumbs={["Document", "Invoice"]} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}>
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:pb-0">
          <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
            <SearchFilter placeholder="Search invoice" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="text-lg placeholder:text-lg" />
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
