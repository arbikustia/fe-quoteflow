import type { ReactElement } from "react";
import { FiCheckCircle, FiDownload, FiEdit2, FiMoreHorizontal } from "react-icons/fi";

import { generateInvoicePDF } from "@/utils/pdfGenerator";

import { ActionMenu } from "@/components/ActionMenu";
import ConfirmModal from "@/components/ConfirmModal";

import { invoiceToQuoteData } from "../Invoice.helpers";
import type { ApiInvoice, InvoiceDetailState } from "../Invoice.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";
import { formatDate, getInvoiceStatusLabel, getQuotationStatusLabel, getStatusBadgeClass } from "@/modules/quotation/detail/QuotationDetail.helpers";
import {
  renderDetailField,
  renderGlobalRemarkSection,
  renderItemsSection,
  renderPricingSection,
  renderProjectsSection,
  renderTransactionSummarySection,
  renderVoucherSummarySection,
} from "@/modules/quotation/detail/QuotationDetail.sections";

/**
 * Render invoice overview.
 * @param {ApiInvoice} invoice - Invoice response
 * @returns {ReactElement} Invoice overview
 */
const _renderInvoiceOverview = (invoice: ApiInvoice): ReactElement => (
  <section className="min-w-0 rounded-3xl border border-border-strong bg-accent-50 p-5 shadow-small sm:p-6">
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="text-lg font-semibold uppercase tracking-widest text-text-tertiary">Invoice</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h2 className="break-all text-2xl font-bold tracking-tight text-text-primary sm:break-words lg:text-3xl">{invoice.invoice_no}</h2>
          <span className="inline-flex w-fit rounded-full bg-action-primary-subtle px-3.5 py-1 text-lg font-bold uppercase tracking-wide text-action-primary">
            {invoice.quotation.transaction.service_type_name}
          </span>
          <span className={`inline-flex w-fit shrink-0 rounded-full px-3.5 py-1 text-lg font-semibold ${invoice.status === 1 ? "bg-accent-600 text-text-inverse" : getStatusBadgeClass(invoice.status)}`}>
            {getInvoiceStatusLabel(invoice.status)}
          </span>
        </div>
      </div>
    </div>
    <dl className="mt-4 grid grid-cols-1 gap-x-8 border-t border-border-default sm:mt-5 sm:grid-cols-3">
      {renderDetailField("Invoice Date", formatDate(invoice.invoice_date))}
      {renderDetailField("Due Date", formatDate(invoice.due_date))}
      {renderDetailField("Quotation No", invoice.quotation.quotation_no)}
      {renderDetailField("Created At", formatDate(invoice.created_at))}
      {renderDetailField("Updated At", formatDate(invoice.updated_at))}
    </dl>
  </section>
);

/**
 * Render invoice and source quotation information.
 * @param {ApiInvoice} invoice - Invoice response
 * @returns {ReactElement} Document information section
 */
const _renderDocumentInformation = (invoice: ApiInvoice): ReactElement => (
  <section className="min-w-0 overflow-hidden rounded-3xl border border-border-strong bg-background-surface shadow-small">
    <header className="border-b border-border-default px-5 py-4 sm:px-6">
      <h2 className="text-xl font-bold text-text-primary sm:text-lg sm:font-semibold">Document Information</h2>
    </header>
    <dl className="grid grid-cols-1 gap-x-8 px-5 py-1 sm:grid-cols-3 sm:px-6 sm:py-0">
      {renderDetailField("Quotation Date", formatDate(invoice.quotation.quotation_date))}
      {renderDetailField("Quotation Status", getQuotationStatusLabel(invoice.quotation.status))}
      {renderDetailField("Quotation Remark", invoice.quotation.notes || "-")}
      {renderDetailField("Quotation Created At", formatDate(invoice.quotation.created_at))}
      {renderDetailField("Quotation Updated At", formatDate(invoice.quotation.updated_at))}
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
  const isProject = transaction.service_type_name.toUpperCase() === "PROJECT";

  return (
    <div className="w-full space-y-4 pb-32 sm:space-y-4 lg:pb-8">
      {_renderInvoiceOverview(invoice)}
      <div className="space-y-4 sm:space-y-4">
        <div className="min-w-0 lg:[&_dl]:grid-cols-3 xl:[&_dl]:grid-cols-4">
          {renderTransactionSummarySection(transaction)}
        </div>
        {_renderDocumentInformation(invoice)}
        {renderGlobalRemarkSection(invoice.quotation.transaction.remarks ?? "")}
        {renderVoucherSummarySection(transaction.voucher)}
        <div className="grid min-w-0 grid-cols-1 items-start gap-4 sm:gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
          <div className="min-w-0 space-y-4 sm:space-y-4">
            {isProject
              ? renderProjectsSection(transaction.rental_transaction_project)
              : renderItemsSection(transaction.rental_transaction_items)}
          </div>
          <aside className="min-w-0 space-y-4 sm:space-y-4">
            {renderPricingSection(transaction)}
          </aside>
        </div>
      </div>
    </div>
  );
};

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
 * Render loading invoice identity and three metadata fields.
 * @returns {ReactElement} Overview skeleton
 */
const _renderSkeletonOverview = (): ReactElement => (
  <section className="min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small sm:p-6" aria-label="Loading invoice overview">
    <div className="h-4 w-20 rounded-3xl bg-background-subtle" />
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <div className="h-8 w-40 rounded-3xl bg-background-subtle" />
      <div className="h-7 w-24 rounded-full bg-background-subtle" />
      <div className="h-7 w-32 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 grid grid-cols-1 gap-x-8 border-t border-border-default sm:mt-5 sm:grid-cols-3">
      {Array.from({ length: 5 }, (_value, index) => _renderSkeletonField(index))}
    </div>
  </section>
);

/**
 * Render loading section with matching card and description grid.
 * @param {number} fieldCount - Number of description fields
 * @param {string} label - Section label
 * @param {boolean} [isWide] - Expand transaction fields at desktop widths
 * @returns {ReactElement} Loading section
 */
const _renderSkeletonSection = (fieldCount: number, label: string, isWide = false): ReactElement => (
  <section className="min-w-0 overflow-hidden rounded-3xl border border-border-strong bg-background-surface shadow-small" aria-label={label}>
    <div className="border-b border-border-default px-5 py-4 sm:px-6"><span className="block h-6 w-40 rounded-3xl bg-background-subtle" /></div>
    <div className={`grid grid-cols-1 gap-x-6 px-5 py-1 sm:grid-cols-2 sm:px-6 sm:py-0 ${isWide ? "lg:grid-cols-3 xl:grid-cols-4" : ""}`}>
      {Array.from({ length: fieldCount }, (_value, index) => _renderSkeletonField(index))}
    </div>
  </section>
);

/**
 * Render loading rental rows with the loaded item or project layout.
 * @returns {ReactElement} Rental skeleton
 */
const _renderSkeletonRental = (): ReactElement => (
  <section className="min-w-0 overflow-hidden rounded-3xl border border-border-strong bg-background-surface shadow-small" aria-label="Loading rental content">
    <div className="border-b border-border-default px-5 py-4 sm:px-6"><div className="h-6 w-36 rounded-3xl bg-background-subtle" /></div>
    <div className="space-y-4 px-5 py-4 sm:px-6">
      {Array.from({ length: 2 }, (_value, index) => (
        <div key={index} className="flex items-start justify-between gap-4 border-b border-border-default pb-4 last:border-0 last:pb-0">
          <div className="space-y-2"><div className="h-6 w-32 rounded-3xl bg-background-subtle" /><div className="h-5 w-24 rounded-3xl bg-background-subtle" /></div>
          <div className="space-y-2"><div className="ml-auto h-6 w-16 rounded-3xl bg-background-subtle" /><div className="h-6 w-24 rounded-3xl bg-background-subtle" /></div>
        </div>
      ))}
    </div>
  </section>
);

/**
 * Render loading pricing rows and grand total.
 * @returns {ReactElement} Pricing skeleton
 */
const _renderSkeletonPricing = (): ReactElement => (
  <section className="min-w-0 overflow-hidden rounded-3xl border border-border-strong bg-background-surface shadow-small" aria-label="Loading pricing summary">
    <div className="border-b border-border-default px-5 py-4 sm:px-6"><div className="h-6 w-36 rounded-3xl bg-background-subtle" /></div>
    <div className="px-5 py-1 sm:px-6">
      {Array.from({ length: 4 }, (_value, index) => _renderSkeletonField(index))}
    </div>
  </section>
);

/**
 * Render invoice loading state with loaded mobile and desktop structure.
 * @returns {ReactElement} Responsive detail skeleton
 */
const _renderDetailSkeleton = (): ReactElement => (
  <div className="w-full space-y-4 pb-32 sm:space-y-4 lg:pb-8" role="status" aria-label="Loading invoice detail">
    <div className="animate-pulse" aria-hidden="true">
      {_renderSkeletonOverview()}
      <div className="mt-4 space-y-4 sm:mt-4 sm:space-y-4">
        {_renderSkeletonSection(12, "Loading transaction and event", true)}
        {_renderSkeletonSection(5, "Loading document information")}
        <div className="grid min-w-0 grid-cols-1 items-start gap-4 sm:gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
          <div className="min-w-0 space-y-4 sm:space-y-4">
            {_renderSkeletonRental()}
          </div>
          <aside className="min-w-0 space-y-4 sm:space-y-4">
            {_renderSkeletonPricing()}
            {_renderSkeletonSection(2, "Loading voucher")}
          </aside>
        </div>
      </div>
    </div>
  </div>
);

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
 * Render invoice detail header actions.
 * @param {InvoiceDetailState} props - Detail state
 * @param {string} approveLabel - Label for approval button
 * @returns {ReactElement | null} Header actions menu
 */
const _renderHeaderActions = (props: InvoiceDetailState, approveLabel: string): ReactElement | null => {
  if (!props.invoice) return null;

  const invoice = props.invoice;

  /**
   * Handle invoice PDF download.
   * @returns {void}
   */
  const handleDownloadPdf = (): void => {
    void generateInvoicePDF(invoiceToQuoteData(invoice));
  };

  return (
    <>
      <div className="hidden items-center gap-3 lg:flex" data-testid="invoice-detail-desktop-actions">
        {invoice.status === 1 && (
          <button type="button" onClick={props.handleEdit} className="inline-flex h-11 items-center gap-2 rounded-3xl border border-border-default px-4 text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle"><FiEdit2 className="h-5 w-5" aria-hidden="true" />Edit</button>
        )}
        <button type="button" onClick={props.openApproveModal} disabled={invoice.status === 2 || props.isApproving} className="inline-flex h-11 items-center gap-2 rounded-3xl bg-success-strong px-4 text-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"><FiCheckCircle className="h-5 w-5" aria-hidden="true" />{approveLabel}</button>
        <button type="button" onClick={handleDownloadPdf} className="inline-flex h-11 items-center gap-2 rounded-3xl bg-action-primary px-4 text-lg font-semibold text-white transition-opacity hover:opacity-90"><FiDownload className="h-5 w-5" aria-hidden="true" />Download PDF</button>
      </div>
      <div className="lg:hidden">
        <ActionMenu testId="invoice-detail-actions" icon={<FiMoreHorizontal className="h-7 w-7" aria-hidden="true" />}>
          {invoice.status === 1 && (
            <button type="button" role="menuitem" onClick={props.handleEdit} className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle"><FiEdit2 className="h-5 w-5" aria-hidden="true" />Edit</button>
          )}
          <button type="button" role="menuitem" onClick={props.openApproveModal} disabled={invoice.status === 2 || props.isApproving} className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-lg font-semibold text-success-strong transition-colors hover:bg-success-subtle disabled:cursor-not-allowed disabled:opacity-60"><FiCheckCircle className="h-5 w-5" aria-hidden="true" />{approveLabel}</button>
          <button type="button" role="menuitem" onClick={handleDownloadPdf} className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle"><FiDownload className="h-5 w-5" aria-hidden="true" />Download PDF</button>
        </ActionMenu>
      </div>
    </>
  );
};

/**
 * Render invoice detail page.
 * @param {InvoiceDetailState} props - Detail state
 * @returns {ReactElement} Invoice detail page
 */
export const InvoiceDetailComponent = (props: InvoiceDetailState): ReactElement => {
  const isApproved = props.invoice?.status === 2;
  const approveLabel = _getApproveLabel(isApproved, props.isApproving);
  const headerActions = _renderHeaderActions(props, approveLabel);

  return (
    <Layout pageTitle="Invoice Detail">
      <PageLayout title="Invoice Detail" subtitle="View invoice details and transaction information" breadcrumbs={["Document", "Invoice", "Detail"]} headerRight={headerActions} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.goBack}>
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {props.isLoading && _renderDetailSkeleton()}
          {!props.isLoading && props.errorMessage && <div role="alert" className="rounded-3xl border border-danger bg-danger-subtle p-5 text-lg font-medium text-danger-strong">{props.errorMessage}</div>}
          {!props.isLoading && !props.errorMessage && !props.invoice && <div className="rounded-3xl border border-border-default bg-background-surface p-8 text-center text-lg text-text-secondary">Invoice detail is unavailable.</div>}
          {!props.isLoading && !props.errorMessage && props.invoice && _renderDetails(props.invoice)}
        </div>
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
