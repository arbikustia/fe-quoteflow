import type { ReactElement } from "react";

import type { ApiPaymentSummaryPayment, PaymentData, PaymentDetailState, PaymentInvoiceOption } from "../Payment.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";
import { renderDetailField } from "@/modules/quotation/detail/QuotationDetail.helper";
import { formatCurrency, formatDate } from "@/modules/quotation/detail/QuotationDetail.util";

/**
 * Render loading description field aligned with detail fields.
 * @param {number} index - Field position
 * @returns {ReactElement} Loading field
 */
const _renderSkeletonField = (index: number): ReactElement => (
  <div key={index} className="grid min-w-0 grid-cols-[minmax(6rem,38%)_minmax(0,1fr)] items-start gap-3 border-b border-border-default/60 py-3 last:border-b-0 sm:block">
    <span className="h-5 w-20 rounded-3xl bg-background-subtle sm:h-4" />
    <span className="h-6 w-28 justify-self-end rounded-3xl bg-background-subtle sm:mt-1 sm:h-5 sm:justify-self-start" />
  </div>
);

/**
 * Render loading section.
 * @param {number} fieldCount - Field count
 * @param {string} label - Accessible label
 * @returns {ReactElement} Loading section
 */
const _renderSkeletonSection = (fieldCount: number, label: string): ReactElement => (
  <section className="min-w-0 overflow-hidden rounded-3xl border border-border-strong bg-background-surface shadow-small" aria-label={label}>
    <div className="border-b border-border-default px-5 py-4 sm:px-6"><span className="block h-6 w-40 rounded-3xl bg-background-subtle" /></div>
    <div className="grid grid-cols-1 gap-x-6 px-5 py-1 sm:grid-cols-2 sm:px-6 sm:py-0">
      {Array.from({ length: fieldCount }, (_value, index) => _renderSkeletonField(index))}
    </div>
  </section>
);

/**
 * Render loading payment overview.
 * @returns {ReactElement} Overview skeleton
 */
const _renderSkeletonOverview = (): ReactElement => (
  <section className="min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small sm:p-6" aria-label="Loading payment overview">
    <div className="h-4 w-20 rounded-3xl bg-background-subtle" />
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <div className="h-8 w-40 rounded-3xl bg-background-subtle" />
      <div className="h-7 w-24 rounded-full bg-background-subtle" />
      <div className="h-7 w-32 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 grid grid-cols-1 gap-x-8 border-t border-border-default sm:mt-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_value, index) => _renderSkeletonField(index))}
    </div>
  </section>
);

/**
 * Render detail skeleton layout.
 * @returns {ReactElement} Skeleton layout
 */
const _renderDetailSkeleton = (): ReactElement => (
  <div className="w-full space-y-4 pb-32 sm:space-y-4 lg:pb-8" role="status" aria-label="Loading payment detail">
    <div className="animate-pulse" aria-hidden="true">
      {_renderSkeletonOverview()}
      <div className="mt-4 grid min-w-0 grid-cols-1 items-start gap-4 sm:gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
        <div className="min-w-0 space-y-4 sm:space-y-4">
          {_renderSkeletonSection(5, "Loading payment info")}
        </div>
        <aside className="min-w-0 space-y-4 sm:space-y-4">
          {_renderSkeletonSection(3, "Loading payment summary")}
        </aside>
      </div>
    </div>
  </div>
);

/**
 * Render payment detail fields.
 * @param {PaymentData} payment - Payment row
 * @param {PaymentInvoiceOption | undefined} linkedInvoice - Linked invoice
 * @returns {ReactElement} Detail fields
 */
const _renderDetailFields = (
  payment: PaymentData,
  linkedInvoice: PaymentInvoiceOption | null | undefined,
): ReactElement => (
  <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
    {renderDetailField("Invoice No", payment.invoiceNo)}
    {renderDetailField("Customer Name", payment.customerName)}
    {renderDetailField("Grand Total", formatCurrency(payment.grandTotal ?? 0))}
    {renderDetailField("Total Paid", formatCurrency(payment.amount))}
    {renderDetailField("Remaining", formatCurrency(payment.remainingAmount ?? 0))}
    {renderDetailField("Status", payment.statusLabel || "-")}
    {linkedInvoice?.event_name && renderDetailField("Event", linkedInvoice.event_name)}
  </dl>
);

/**
 * Render payment history entries.
 * @param {ApiPaymentSummaryPayment[]} entries - Payment entries
 * @returns {ReactElement} History entries
 */
const _renderHistoryEntries = (entries: ApiPaymentSummaryPayment[]): ReactElement => {
  if (entries.length === 0) {
    return <p className="py-6 text-center text-lg text-text-secondary">No payment recorded for this invoice.</p>;
  }

  return (
    <ul className="space-y-3">
      {entries.map((entry): ReactElement => (
        <li key={entry.id} className="rounded-2xl border border-border-default px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-lg font-semibold text-text-primary">{entry.payment_method_name}</span>
            <span className="text-lg font-semibold tabular-nums text-text-primary">{formatCurrency(entry.amount)}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-lg text-text-secondary">
            <span>{formatDate(entry.paid_at)}</span>
            {entry.notes && <span className="break-words">{entry.notes}</span>}
          </div>
        </li>
      ))}
    </ul>
  );
};

/**
 * Render payment detail sections.
 * @param {PaymentData} payment - Payment row
 * @param {PaymentInvoiceOption | undefined} linkedInvoice - Linked invoice
 * @param {ApiPaymentSummaryPayment[]} entries - Payment entries
 * @returns {ReactElement} Payment sections
 */
const _renderDetail = (
  payment: PaymentData,
  linkedInvoice: PaymentInvoiceOption | null | undefined,
  entries: ApiPaymentSummaryPayment[],
): ReactElement => (
  <div className="w-full space-y-4 pb-32 sm:space-y-4 lg:pb-8">
    <section className="min-w-0 overflow-hidden rounded-3xl border border-border-strong bg-background-surface shadow-small">
      <header className="border-b border-border-default px-5 py-4 sm:px-6">
        <h2 className="text-xl font-bold text-text-primary sm:text-lg sm:font-semibold">
          Payment Details
        </h2>
      </header>
      <div className="px-5 py-6 sm:px-6 sm:py-6">
        {_renderDetailFields(payment, linkedInvoice)}
      </div>
    </section>

    <section className="min-w-0 overflow-hidden rounded-3xl border border-border-strong bg-background-surface shadow-small">
      <header className="border-b border-border-default px-5 py-4 sm:px-6">
        <h2 className="text-xl font-bold text-text-primary sm:text-lg sm:font-semibold">
          Payment History ({entries.length})
        </h2>
      </header>
      <div className="px-5 py-5 sm:px-6">
        {_renderHistoryEntries(entries)}
      </div>
    </section>
  </div>
);

/**
 * Render payment detail component.
 * @param {PaymentDetailState} props - Detail state
 * @returns {ReactElement} Detail page
 */
export const PaymentDetailComponent = (props: PaymentDetailState): ReactElement => (
    <Layout pageTitle="Payment Detail">
      <PageLayout
        title="Payment Detail"
        subtitle="View payment details and transaction information"
        breadcrumbs={["Payment", "Detail"]}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={props.goBack}
      >
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {props.isLoading && _renderDetailSkeleton()}
          {!props.isLoading && props.errorMessage && (
            <div role="alert" className="rounded-3xl border border-danger bg-danger-subtle p-5 text-lg font-medium text-danger-strong">
              {props.errorMessage}
            </div>
          )}
          {!props.isLoading && !props.errorMessage && !props.payment && (
            <div className="rounded-3xl border border-border-default bg-background-surface p-8 text-center text-lg text-text-secondary">
              Payment detail is unavailable.
            </div>
          )}
          {!props.isLoading && !props.errorMessage && props.payment && (
            _renderDetail(props.payment, props.linkedInvoice, props.paymentEntries)
          )}
        </div>
      </PageLayout>
    </Layout>
);
