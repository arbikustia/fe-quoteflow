/* eslint-disable jsdoc/require-jsdoc */
import * as React from "react";
import { FiEdit2, FiEye } from "react-icons/fi";

import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import type { PaymentData, PaymentMobileCardProps, PaymentProps } from "./Payment.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";
import { formatCurrency, formatDate } from "@/modules/quotation/detail/QuotationDetail.helpers";

/**
 * Render row number cell.
 * @param {PaymentProps} props - Payment props
 * @param {number} index - Zero-based index
 * @returns {React.ReactElement} Row number element
 */
const _renderRowNumber = (props: PaymentProps, index: number): React.ReactElement => (
  <span className="text-lg">{(props.currentPage - 1) * props.pageSize + index + 1}</span>
);

/**
 * Render invoice id cell.
 * @param {PaymentData} row - Payment row
 * @returns {React.ReactElement} Invoice id element
 */
const _renderInvoiceNo = (row: PaymentData): React.ReactElement => (
  <span className="text-lg font-medium">{row.invoiceNo}</span>
);

/**
 * Render payment method cell.
 * @param {PaymentData} row - Payment row
 * @returns {React.ReactElement} Payment method element
 */
const _renderCustomerName = (row: PaymentData): React.ReactElement => (
  <span className="text-lg">{row.customerName}</span>
);

/**
 * Render payment amount cell.
 * @param {PaymentData} row - Payment row
 * @returns {React.ReactElement} Amount element
 */
const _renderAmount = (row: PaymentData): React.ReactElement => (
  <span className="text-lg font-semibold">{formatCurrency(row.amount)}</span>
);

/**
 * Render paid at date cell.
 * @param {PaymentData} row - Payment row
 * @returns {React.ReactElement} Paid date element
 */
const _renderPaidAt = (row: PaymentData): React.ReactElement => (
  <span className="text-lg">{formatDate(row.paidAt)}</span>
);

const _renderCreatedAt = (row: PaymentData): React.ReactElement => (
  <span className="text-lg">{formatDate(row.createdAt)}</span>
);

/**
 * Render payment status badge cell.
 * @param {PaymentData} row - Payment row
 * @returns {React.ReactElement} Status badge element
 */
const _renderStatus = (row: PaymentData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${row.status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
    {row.status === "active" ? "Active" : "Inactive"}
  </span>
);

/**
 * Render payment edit action.
 * @param {PaymentData} payment - Payment row
 * @param {(payment: PaymentData) => void} onEdit - Edit callback
 * @returns {React.ReactElement} Edit button
 */
const _renderActions = (
  payment: PaymentData,
  onDetail: (payment: PaymentData) => void,
  onEdit: (payment: PaymentData) => void,
): React.ReactElement => (
  <div className="flex items-center justify-center gap-1">
    <button
      type="button"
      onClick={(event: React.MouseEvent): void => {
        event.stopPropagation();
        onDetail(payment);
      }}
      className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
      title="View payment detail"
      aria-label="View payment detail"
    >
      <FiEye className="h-5 w-5" />
    </button>
    <button
      type="button"
      onClick={(event: React.MouseEvent): void => {
        event.stopPropagation();
        onEdit(payment);
      }}
      className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
      title="Edit payment"
      aria-label="Edit payment"
    >
      <FiEdit2 className="h-5 w-5" />
    </button>
  </div>
);

/**
 * Build payment table columns.
 * @param {PaymentProps} props - Payment page props
 * @returns {TableColumn<PaymentData>[]} Payment columns
 */
const _getColumns = (props: PaymentProps): TableColumn<PaymentData>[] => [
  { key: "no", header: "No", align: "center", render: (_row: PaymentData, index: number): React.ReactElement => _renderRowNumber(props, index) },
  { key: "invoiceNo", header: "Invoice No", render: _renderInvoiceNo },
  { key: "customerName", header: "Customer Name", render: _renderCustomerName },
  { key: "amount", header: "Amount", align: "right", render: _renderAmount },
  { key: "paidAt", header: "Paid At", render: _renderPaidAt },
  { key: "createdAt", header: "Created At", render: _renderCreatedAt },
  { key: "status", header: "Status", align: "center", render: _renderStatus },
  { key: "actions", header: "Action", align: "center", render: (row: PaymentData): React.ReactElement => _renderActions(row, props.onDetail ?? props.onRowClick, props.onEdit) },
];

/**
 * Get column text alignment class.
 * @param {string} [align] - Alignment
 * @returns {string} Alignment class
 */
const _getColumnAlignClass = (align?: string): string => {
  if (align === "center") return "text-center";

  if (align === "right") return "text-right";

  return "text-left";
};

/**
 * Render payment table skeleton using real table columns and spacing.
 * @param {PaymentProps} props - Payment page props
 * @returns {React.ReactElement} Payment table skeleton
 */
const _renderPaymentTableSkeleton = (props: PaymentProps): React.ReactElement => {
  const columns = _getColumns(props);
  const widths = ["w-6", "w-28", "w-28", "w-32", "w-28", "w-24", "w-32"];

  return (
    <div className="w-full overflow-x-auto" role="status" aria-label="Loading payment table">
      <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={column.key} className={`bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary ${_getColumnAlignClass(column.align)} ${index === 0 ? "rounded-l-3xl" : ""} ${index === columns.length - 1 ? "rounded-r-3xl" : ""}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }, (_value, rowIndex) => (
            <tr key={rowIndex} className="animate-pulse">
              {columns.map((column, index) => (
                <td key={column.key} className={`border-b border-border-default px-5 py-4 ${_getColumnAlignClass(column.align)}`}>
                  {column.key === "actions" ? (
                    <span className="inline-block h-10 w-10 rounded-3xl bg-background-subtle align-middle" />
                  ) : (
                    <span className={`inline-block h-5 rounded-3xl bg-background-subtle align-middle ${column.key === "status" ? "w-28 rounded-full" : widths[index]}`} />
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
 * Render payment card on mobile.
 * @param {PaymentMobileCardProps} props - Payment card props
 * @returns {React.ReactElement} Payment card
 */
export const PaymentMobileCard = ({ payment, onClick }: PaymentMobileCardProps): React.ReactElement => (
  <button
    type="button"
    onClick={(): void => onClick(payment)}
    className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
  >
    <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
      <span className="min-w-0 break-all text-lg font-medium text-text-secondary">{payment.referenceNo}</span>
      <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${payment.status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
        {payment.status === "active" ? "Active" : "Inactive"}
      </span>
    </span>
    <span className="mt-4 block break-all text-xl font-semibold text-text-primary">{payment.invoiceNo}</span>
    <span className="mt-1.5 block break-words text-lg text-text-secondary">{payment.customerName}</span>
    <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <span className="min-w-0 text-lg text-text-secondary">
        <span className="block text-lg text-text-tertiary">Paid at</span>
        <span className="mt-1 block text-lg font-medium text-text-primary">{formatDate(payment.paidAt)}</span>
      </span>
      <span className="text-right tabular-nums">
        <span className="block text-lg text-text-tertiary">Amount</span>
        <span className="mt-1 block text-xl font-semibold text-text-primary">{formatCurrency(payment.amount)}</span>
      </span>
    </span>
  </button>
);

/**
 * Render payment mobile card skeleton matching final card.
 * @param {number} key - Skeleton key
 * @returns {React.ReactElement} Payment mobile card skeleton
 */
const _renderPaymentCardSkeleton = (key: number): React.ReactElement => (
  <div key={key} className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small" role="status" aria-label="Loading payment card">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="h-7 w-28 rounded-3xl bg-background-subtle" />
      <div className="h-8 w-20 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 h-7 w-4/5 rounded-3xl bg-background-subtle" />
    <div className="mt-1.5 h-7 w-3/5 rounded-3xl bg-background-subtle" />
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <div>
        <div className="h-7 w-16 rounded-3xl bg-background-subtle" />
        <div className="mt-1 h-7 w-28 rounded-3xl bg-background-subtle" />
      </div>
      <div className="text-right">
        <div className="ml-auto h-7 w-16 rounded-3xl bg-background-subtle" />
        <div className="mt-1 h-7 w-28 rounded-3xl bg-background-subtle" />
      </div>
    </div>
  </div>
);

/**
 * Render payment list state.
 * @param {PaymentProps} props - Payment page props
 * @returns {React.ReactElement | null} List state
 */
const _renderListState = (props: PaymentProps): React.ReactElement | null => {
  if (props.isMissingData) return <p className="py-10 text-center text-lg text-danger">Payment data is unavailable. Please try again.</p>;

  if (props.errorMessage) return <p className="py-10 text-center text-lg text-danger">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-lg text-text-secondary">No payments found.</p>;

  return null;
};

/**
 * Render mobile payment card list.
 * @param {PaymentProps} props - Payment props
 * @returns {React.ReactElement} Mobile payment content
 */
const _renderMobileContent = (props: PaymentProps): React.ReactElement => {
  if (props.isLoading) {
    return <>{Array.from({ length: 5 }, (_value, index) => _renderPaymentCardSkeleton(index))}</>;
  }

  const listState = _renderListState(props);

  if (listState) return listState;

  return <>{props.paginatedData.map((payment) => <PaymentMobileCard key={payment.id} payment={payment} onClick={props.onRowClick} />)}</>;
};

/**
 * Render desktop table content.
 * @param {PaymentProps} props - Payment props
 * @returns {React.ReactElement} Table content
 */
const _renderTableContent = (props: PaymentProps): React.ReactElement => {
  if (props.isLoading) return _renderPaymentTableSkeleton(props);

  const listState = _renderListState(props);

  if (listState) return listState;

  return <Table data={props.paginatedData} columns={_getColumns(props)} onRowClick={props.onRowClick} keyExtractor={(row: PaymentData): string => row.id} isDetail={true} />;
};

/**
 * Render mobile payment cards.
 * @param {PaymentProps} props - Payment page props
 * @returns {React.ReactElement} Mobile payment list
 */
const _renderMobileCards = (props: PaymentProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter placeholder="Search payment" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="!h-16 text-xl placeholder:text-xl" />
      <div className="flex min-w-0 flex-col gap-4">
        {_renderMobileContent(props)}
      </div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs" />
    </div>
  );
};

/**
 * Render desktop table view.
 * @param {PaymentProps} props - Payment props
 * @returns {React.ReactElement} Desktop table section
 */
const _renderTable = (props: PaymentProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
        <SearchFilter placeholder="Search payment" onChange={handleSearch} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" />
        <button type="button" onClick={props.onCreate} className="h-14 rounded-3xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover">
          Create Payment
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {_renderTableContent(props)}
      </div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} className="pt-4" />
    </div>
  );
};

/**
 * Render payment page.
 * @param {PaymentProps} props - Payment page props
 * @returns {React.ReactElement} Payment page
 */
export const PaymentComponent = (props: PaymentProps): React.ReactElement => {
  const createButton = (
    <button
      type="button"
      onClick={props.onCreate}
      className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-lg font-bold text-action-primary transition-colors hover:bg-action-primary-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring lg:hidden"
    >
      Create New
    </button>
  );

  return (
    <Layout pageTitle="Payment List">
      <PageLayout
        title="Payment List"
        subtitle="Manage document payments and status"
        breadcrumbs={["Document", "Payment"]}
        headerRight={createButton}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={props.onBack}
      >
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobileCards(props)}
          {_renderTable(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
