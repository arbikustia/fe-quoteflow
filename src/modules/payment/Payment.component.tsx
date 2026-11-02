/* eslint-disable jsdoc/require-jsdoc */
import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import { MasterDataCard } from "@/components/MasterDataCard";
import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import type { PaymentData, PaymentProps } from "./Payment.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

/**
 * Build payment table columns.
 * @param {PaymentProps} props - Payment page props
 * @returns {TableColumn<PaymentData>[]} Payment columns
 */
const _getColumns = (props: PaymentProps): TableColumn<PaymentData>[] => [
  { key: "no", header: "No", align: "center", render: (_row: PaymentData, index: number): React.ReactElement => <span>{(props.currentPage - 1) * props.pageSize + index + 1}</span> },
  { key: "referenceNo", header: "Reference No" },
  { key: "invoiceId", header: "Invoice ID" },
  { key: "paymentMethodId", header: "Payment Method" },
  { key: "amount", header: "Amount", align: "right", render: (row: PaymentData): React.ReactElement => <span>{row.amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span> },
  { key: "paidAt", header: "Paid At", render: (row: PaymentData): React.ReactElement => <span>{new Date(row.paidAt).toLocaleString("id-ID")}</span> },
  { key: "notes", header: "Notes" },
  { key: "actions", header: "Action", align: "center", render: (row: PaymentData): React.ReactElement => _renderEditAction(row, props.onEdit) },
];

/**
 * Render payment edit action.
 * @param {PaymentData} payment - Payment row
 * @param {(payment: PaymentData) => void} onEdit - Edit callback
 * @returns {React.ReactElement} Edit button
 */
const _renderEditAction = (payment: PaymentData, onEdit: (payment: PaymentData) => void): React.ReactElement => (
  <button
    type="button"
    onClick={(event: React.MouseEvent): void => {
      event.stopPropagation();
      onEdit(payment);
    }}
    className="cursor-pointer rounded-lg p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
    title="Edit payment"
    aria-label="Edit payment"
  >
    <FiEdit2 className="h-5 w-5" />
  </button>
);

/**
 * Render payment table skeleton matching real columns.
 * @returns {React.ReactElement} Payment table skeleton
 */
const _renderPaymentTableSkeleton = (): React.ReactElement => {
  const columns = ["8%", "15%", "14%", "15%", "13%", "14%", "13%", "8%"];

  return (
    <div className="min-w-225 animate-pulse overflow-hidden" role="status" aria-label="Loading payment table">
      <div className="flex h-12 items-center gap-4 border-b border-border-default bg-background-subtle px-4">{columns.map((width, index) => <div key={`payment-table-header-${index}`} className="h-4 rounded bg-background-muted" style={{ width }} />)}</div>
      {Array.from({ length: 5 }, (_value, rowIndex) => <div key={`payment-table-row-${rowIndex}`} className="flex h-14 items-center gap-4 border-b border-border-default px-4">{columns.map((width, columnIndex) => <div key={`payment-table-cell-${rowIndex}-${columnIndex}`} className="h-4 rounded bg-background-subtle" style={{ width }} />)}</div>)}
    </div>
  );
};

/**
 * Render payment mobile card skeleton matching MasterDataCard.
 * @param {number} key - Skeleton key
 * @returns {React.ReactElement} Payment mobile card skeleton
 */
const _renderPaymentCardSkeleton = (key: number): React.ReactElement => (
  <div key={key} className="animate-pulse rounded-2xl border border-border-default bg-background-surface p-5" role="status" aria-label="Loading payment card">
    <div className="flex items-start justify-between gap-4"><div className="h-7 w-2/5 rounded bg-background-subtle" /><div className="h-6 w-16 rounded-full bg-background-subtle" /></div>
    <div className="mt-3 grid gap-2"><div className="h-5 w-3/5 rounded bg-background-subtle" /><div className="h-5 w-2/3 rounded bg-background-subtle" /></div>
  </div>
);

/**
 * Render payment list state.
 * @param {PaymentProps} props - Payment page props
 * @returns {React.ReactElement | null} List state
 */
const _renderListState = (props: PaymentProps): React.ReactElement | null => {
  if (props.isLoading) return _renderPaymentTableSkeleton();

  if (props.isMissingData) return <p className="py-10 text-center text-sm text-danger">Payment data is unavailable. Please try again.</p>;

  if (props.errorMessage) return <p className="py-10 text-center text-sm text-danger">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-sm text-text-secondary">No payments found.</p>;

  return null;
};

/**
 * Render mobile payment cards.
 * @param {PaymentProps} props - Payment page props
 * @param {React.ReactElement | null} listState - List state
 * @returns {React.ReactElement} Mobile payment list
 */
const _renderMobileCards = (props: PaymentProps, listState: React.ReactElement | null): React.ReactElement => (
  <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
    <SearchFilter placeholder="Search payment" onChange={(event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value)} isRoundedFull={true} className="w-full sm:w-full" inputClassName="!h-16 text-xl placeholder:text-xl" />
    <div className="min-w-0 space-y-3">
      {props.isLoading ? Array.from({ length: 5 }, (_value, index) => _renderPaymentCardSkeleton(index)) : listState ?? props.paginatedData.map((payment) => <MasterDataCard key={payment.id} title={payment.referenceNo} status={payment.status} isLargeText={true} onClick={(): void => props.onEdit(payment)}><span className="grid gap-1 text-lg text-text-secondary"><span className="truncate">{payment.invoiceId}</span><span>{payment.amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span></span></MasterDataCard>)}
    </div>
    <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" />
  </div>
);

/**
 * Render payment page.
 * @param {PaymentProps} props - Payment page props
 * @returns {React.ReactElement} Payment page
 */
export const PaymentComponent = (props: PaymentProps): React.ReactElement => {
  const columns = _getColumns(props);
  const listState = _renderListState(props);
  const createButton = (
    <button
      type="button"
      onClick={props.onCreate}
      className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-sm font-bold text-action-primary transition-colors hover:bg-action-primary-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring lg:hidden"
    >
      Create New
    </button>
  );

  return (
    <Layout pageTitle="Payment List" mobileWhiteBackground={true}>
      <PageLayout
        title="Payment List"
        subtitle="Manage document payments and status"
        breadcrumbs={["Document", "Payment"]}
        headerRight={createButton}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={props.onBack}
      >
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:pb-0">
          {_renderMobileCards(props, listState)}
          <div className="hidden rounded-4xl border border-border-default bg-background-surface px-6 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
            <div className="flex items-center justify-between gap-4 py-6"><SearchFilter placeholder="Search payment" onChange={(event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value)} /><button type="button" onClick={props.onCreate} className="h-14 rounded-xl bg-action-primary px-6 text-sm font-semibold text-text-inverse hover:bg-action-primary-hover">Create Payment</button></div>
            <div className="flex-1 overflow-auto">{listState ?? <Table data={props.paginatedData} columns={columns} onRowClick={props.onRowClick} keyExtractor={(row: PaymentData): string => row.id} />}</div>
            <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} />
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
};
