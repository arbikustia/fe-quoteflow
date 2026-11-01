import type { ReactElement } from "react";
import { FiCheckCircle, FiEdit2, FiMoreHorizontal } from "react-icons/fi";

import ConfirmModal from "@/components/ConfirmModal";
import { SkeletonComponent } from "@/components/Skeleton";

import type { ApiInvoice, InvoiceDetailState } from "../Invoice.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";
import { formatDate } from "@/modules/quotation/detail/QuotationDetail.helpers";
import {
  renderItemsSection,
  renderPricingSection,
  renderProjectsSection,
  renderTransactionSection,
  renderVoucherSection,
} from "@/modules/quotation/detail/QuotationDetail.sections";

/**
 * Render invoice overview.
 * @param {ApiInvoice} invoice - Invoice response
 * @returns {ReactElement} Invoice overview
 */
const _renderInvoiceOverview = (invoice: ApiInvoice): ReactElement => (
  <section className="rounded-2xl border border-border-default bg-background-surface p-4 shadow-xs sm:p-5 lg:p-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Invoice</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h2 className="break-words text-3xl font-semibold tracking-tight text-text-primary sm:text-2xl lg:text-3xl">{invoice.invoice_no}</h2>
          <span className="inline-flex w-fit rounded-full bg-action-primary-subtle px-3 py-1 text-sm font-bold uppercase tracking-wide text-action-primary">
            {invoice.quotation.transaction.service_type_name}
          </span>
          <span className="inline-flex w-fit rounded-full bg-success-subtle px-3 py-1 text-sm font-bold uppercase text-success-strong sm:text-xs">
            APPROVED
          </span>
        </div>
      </div>
    </div>
    <dl className="mt-5 grid grid-cols-1 gap-x-8 border-t border-border-default sm:grid-cols-2 lg:grid-cols-4">
      <div className="grid grid-cols-[minmax(7rem,40%)_minmax(0,1fr)] items-start gap-2 border-b border-border-default/60 py-3 sm:block sm:py-4"><dt className="text-lg font-medium leading-7 text-text-secondary sm:mb-1 sm:text-sm sm:font-semibold sm:uppercase sm:tracking-wide sm:text-text-tertiary">Invoice Date</dt><dd className="text-right text-xl font-medium leading-8 text-text-primary sm:text-left sm:text-base">{formatDate(invoice.invoice_date)}</dd></div>
      <div className="grid grid-cols-[minmax(7rem,40%)_minmax(0,1fr)] items-start gap-2 border-b border-border-default/60 py-3 sm:block sm:py-4"><dt className="text-lg font-medium leading-7 text-text-secondary sm:mb-1 sm:text-sm sm:font-semibold sm:uppercase sm:tracking-wide sm:text-text-tertiary">Due Date</dt><dd className="text-right text-xl font-medium leading-8 text-text-primary sm:text-left sm:text-base">{formatDate(invoice.due_date)}</dd></div>
      <div className="grid grid-cols-[minmax(7rem,40%)_minmax(0,1fr)] items-start gap-2 border-b border-border-default/60 py-3 last:border-b-0 sm:block sm:py-4"><dt className="text-lg font-medium leading-7 text-text-secondary sm:mb-1 sm:text-sm sm:font-semibold sm:uppercase sm:tracking-wide sm:text-text-tertiary">Quotation No</dt><dd className="break-words text-right text-xl font-medium leading-8 text-text-primary sm:text-left sm:text-base">{invoice.quotation.quotation_no}</dd></div>
    </dl>
  </section>
);

/**
 * Render invoice detail content.
 * @param {ApiInvoice} invoice - Invoice response
 * @returns {ReactElement} Invoice sections
 */
const _renderDetails = (invoice: ApiInvoice): ReactElement => {
  const transaction = invoice.quotation.transaction;
  const serviceTypeName = transaction.service_type_name.toUpperCase();

  return (
    <div className="space-y-4 pb-8 sm:space-y-5">
      {_renderInvoiceOverview(invoice)}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
        <div className="space-y-4 sm:space-y-5">
          {renderTransactionSection(transaction)}
          {serviceTypeName === "REGULER" && renderItemsSection(transaction.rental_transaction_items)}
          {serviceTypeName === "PROJECT" && renderProjectsSection(transaction.rental_transaction_project)}
        </div>
        <aside className="space-y-4 sm:space-y-5">
          {renderPricingSection(transaction)}
          {renderVoucherSection(transaction.voucher)}
        </aside>
      </div>
    </div>
  );
};

/**
 * Resolve invoice approve button label.
 * @param {boolean} isApproved - Approval status
 * @param {boolean} isApproving - Mutation loading state
 * @returns {string} Button label
 */
const _getApproveLabel = (isApproved: boolean, isApproving: boolean): string => {
  if (isApproved) return "Approved";

  if (isApproving) return "Approving...";

  return "Approve";
};

/**
 * Render invoice detail page.
 * @param {InvoiceDetailState} props - Detail state
 * @returns {ReactElement} Invoice detail page
 */
export const InvoiceDetailComponent = (props: InvoiceDetailState): ReactElement => {
  const isApproved = props.invoice?.status === 2;
  const approveLabel = _getApproveLabel(isApproved, props.isApproving);
  const onEditClick = props.handleEdit ?? props.goEdit;

  const headerActions = props.invoice ? (
    <details className="relative shrink-0">
      <summary data-testid="invoice-detail-actions" className="flex h-14 w-14 cursor-pointer list-none items-center justify-center rounded-2xl border border-border-default text-text-secondary transition-colors hover:bg-background-subtle hover:text-text-primary" aria-label="More options">
        <FiMoreHorizontal className="h-7 w-7" aria-hidden="true" />
      </summary>
      <div role="menu" className="absolute right-0 top-16 z-20 w-56 overflow-hidden rounded-2xl border border-border-default bg-background-surface py-2 shadow-lg">
        {onEditClick && <button type="button" role="menuitem" onClick={onEditClick} className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle"><FiEdit2 className="h-5 w-5" aria-hidden="true" />Edit</button>}
        <button type="button" role="menuitem" onClick={props.openApproveModal} disabled={props.isApproving} className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-lg font-semibold text-success-strong transition-colors hover:bg-success-subtle disabled:cursor-not-allowed disabled:opacity-60"><FiCheckCircle className="h-5 w-5" aria-hidden="true" />{approveLabel}</button>
      </div>
    </details>
  ) : null;

  return (
    <Layout pageTitle="Invoice Detail" mobileWhiteBackground={true}>
      <PageLayout title="Invoice Detail" subtitle="View invoice details and transaction information" breadcrumbs={["Document", "Invoice", "Detail"]} headerRight={headerActions} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.goBack}>
      {props.isLoading && <div className="rounded-2xl border border-border-default bg-background-surface p-5"><SkeletonComponent rows={8} columns={[{ width: "35%" }, { width: "65%" }]} /></div>}
      {!props.isLoading && props.errorMessage && <div role="alert" className="rounded-2xl border border-danger bg-danger-subtle p-5 text-sm font-medium text-danger-strong">{props.errorMessage}</div>}
      {!props.isLoading && !props.errorMessage && !props.invoice && <div className="rounded-2xl border border-border-default bg-background-surface p-8 text-center text-sm text-text-secondary">Invoice detail is unavailable.</div>}
      {!props.isLoading && !props.errorMessage && props.invoice && _renderDetails(props.invoice)}
      </PageLayout>
      <ConfirmModal
        isOpen={props.isConfirmOpen}
        onClose={props.closeApproveModal}
        onConfirm={(): void => { void props.handleApprove(); }}
        title="Approve invoice?"
        message="This will mark this invoice as approved."
        confirmText={props.isApproving ? "Approving..." : "Approve"}
        isDestructive={false}
      />
    </Layout>
  );
};
