import type { ReactElement } from "react";
import { FiEdit2, FiMoreHorizontal } from "react-icons/fi";

import type { PaymentData, PaymentDetailState, PaymentInvoiceOption } from "../Payment.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";
import { formatCurrency, formatDate } from "@/modules/quotation/detail/QuotationDetail.helpers";
import { renderDetailField } from "@/modules/quotation/detail/QuotationDetail.sections";

/**
 * Render payment overview card matching quotation overview.
 * @param {PaymentData} payment - Payment row
 * @param {PaymentInvoiceOption | null | undefined} linkedInvoice - Linked invoice
 * @param {string | undefined} methodName - Method name
 * @returns {ReactElement} Payment overview
 */
const _renderPaymentOverview = (
  payment: PaymentData,
  methodName?: string,
): ReactElement => (
  <section className="min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small sm:p-6">
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="text-lg font-semibold uppercase tracking-widest text-text-tertiary">Payment</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h2 className="break-all text-2xl font-bold tracking-tight text-text-primary sm:break-words lg:text-3xl">
            {payment.referenceNo}
          </h2>
          <span className="inline-flex w-fit rounded-full bg-action-primary-subtle px-3.5 py-1 text-lg font-bold uppercase tracking-wide text-action-primary">
            {methodName ?? payment.paymentMethodId}
          </span>
          <span
            className={`inline-flex w-fit shrink-0 rounded-full px-3.5 py-1 text-lg font-semibold ${
              payment.status === "active" ? "bg-success-subtle text-success-strong" : "bg-background-muted text-text-tertiary"
            }`}
          >
            {payment.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
    <dl className="mt-4 grid grid-cols-1 gap-x-8 border-t border-border-default sm:mt-5 sm:grid-cols-2 lg:grid-cols-4">
      {renderDetailField("Payment Date", formatDate(payment.paidAt))}
      {renderDetailField("Amount", formatCurrency(payment.amount))}
      {renderDetailField("Invoice No", payment.invoiceNo)}
      {renderDetailField("Customer Name", payment.customerName)}
    </dl>
  </section>
);

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
 * Render payment detail sections.
 * @param {PaymentData} payment - Payment row
 * @param {PaymentInvoiceOption | null | undefined} linkedInvoice - Linked invoice
 * @param {string | undefined} methodName - Method name
 * @returns {ReactElement} Payment sections
 */
// eslint-disable-next-line max-lines-per-function
const _renderDetail = (
  payment: PaymentData,
  linkedInvoice?: PaymentInvoiceOption | null,
  methodName?: string,
): ReactElement => (
  <div className="w-full space-y-4 pb-32 sm:space-y-4 lg:pb-8">
    <section className="min-w-0 overflow-hidden rounded-3xl border border-border-strong bg-background-surface shadow-small">
      <header className="border-b border-border-default px-5 py-4 sm:px-6">
        <h2 className="text-xl font-bold text-text-primary sm:text-lg sm:font-semibold">
          Payment Details
        </h2>
      </header>
      <div className="px-5 py-6 sm:px-6 sm:py-6">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
          {renderDetailField("Invoice No", payment.invoiceNo)}
          {renderDetailField("Customer Name", payment.customerName)}
          {renderDetailField("Payment Date", formatDate(payment.paidAt))}
          {renderDetailField("Amount", formatCurrency(payment.amount))}
          {renderDetailField("Payment Method", methodName ?? payment.paymentMethodId)}
          {renderDetailField("Created At", formatDate(payment.createdAt))}
          {renderDetailField("Status", payment.status === "active" ? "Active" : "Inactive")}
          {linkedInvoice?.event_name && renderDetailField("Event", linkedInvoice.event_name)}
        </dl>
      </div>
    </section>
  </div>
);

/**
 * Render payment detail component.
 * @param {PaymentDetailState} props - Detail state
 * @returns {ReactElement} Detail page
 */
// eslint-disable-next-line max-lines-per-function
export const PaymentDetailComponent = (props: PaymentDetailState): ReactElement => {
const headerActions = props.payment ? (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={props.handleEdit}
        className="hidden h-14 items-center gap-3 rounded-3xl border border-action-primary bg-background-surface px-6 text-lg font-bold text-action-primary transition-colors hover:bg-action-primary-subtle lg:flex"
      >
        <FiEdit2 className="h-5 w-5" aria-hidden="true" />
        Edit
      </button>

      <details className="relative shrink-0 lg:hidden">
        <summary
          data-testid="payment-detail-actions"
          className="flex h-14 w-14 cursor-pointer list-none items-center justify-center rounded-3xl border border-border-default text-text-secondary transition-colors hover:bg-background-subtle hover:text-text-primary"
          aria-label="More options"
        >
          <FiMoreHorizontal className="h-7 w-7" aria-hidden="true" />
        </summary>
        <div
          role="menu"
          className="absolute right-0 top-16 z-20 w-56 overflow-hidden rounded-3xl border border-border-default bg-background-surface py-2 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={props.handleEdit}
            className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle"
          >
            <FiEdit2 className="h-5 w-5" aria-hidden="true" />
            Edit
          </button>
        </div>
      </details>
    </div>
  ) : null;

  return (
    <Layout pageTitle="Payment Detail">
      <PageLayout
        title="Payment Detail"
        subtitle="View payment details and transaction information"
        breadcrumbs={["Payment", "Detail"]}
        headerRight={headerActions}
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
            _renderDetail(props.payment, props.linkedInvoice, props.methodName)
          )}
        </div>
      </PageLayout>
    </Layout>
  );
};
