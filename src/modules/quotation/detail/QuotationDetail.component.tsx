import type { ReactElement } from "react";
import { FiCheckCircle, FiDownload, FiEdit2, FiMoreHorizontal } from "react-icons/fi";

import { generateQuotationPDF } from "@/utils/pdfGenerator";

import { ActionMenu } from "@/components/ActionMenu";
import ConfirmModal from "@/components/ConfirmModal";

import { quotationToQuoteData } from "../Quotation.helpers";
import type { ApiQuotation, QuotationDetailState } from "../Quotation.type";

import {
  renderGlobalRemarkSection,
  renderItemsSection,
  renderPricingSection,
  renderProjectsSection,
  renderQuotationOverview,
  renderTransactionSummarySection,
  renderVoucherSummarySection,
} from "./QuotationDetail.sections";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

/**
 * Render quotation detail content.
 * @param {ApiQuotation} quotation - Quotation response
 * @returns {ReactElement} Detail sections
 */
const _renderDetail = (quotation: ApiQuotation): ReactElement => {
  const isProject = quotation.transaction.service_type_name.toUpperCase() === "PROJECT";

  return (
    <div className="w-full space-y-4 pb-32 sm:space-y-4 lg:pb-8">
      {renderQuotationOverview(quotation)}
      <div className="space-y-4 sm:space-y-4">
        <div className="min-w-0 lg:[&_dl]:grid-cols-3 xl:[&_dl]:grid-cols-4">
          {renderTransactionSummarySection(quotation.transaction)}
        </div>
        {renderVoucherSummarySection(quotation.transaction.voucher)}
        {renderGlobalRemarkSection(quotation.notes)}
        <div className="grid min-w-0 grid-cols-1 items-start gap-4 sm:gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
          <div className="min-w-0 space-y-4 sm:space-y-4">
            {isProject
              ? renderProjectsSection(quotation.transaction.rental_transaction_project, false)
              : renderItemsSection(quotation.transaction.rental_transaction_items)}
          </div>
          <aside className="min-w-0 space-y-4 sm:space-y-4">
            {renderPricingSection(quotation.transaction)}
          </aside>
        </div>
      </div>
    </div>
  );
};

/**
 * Render a loading description row in mobile and desktop layouts.
 * @param {number} index - Row position
 * @returns {ReactElement} Loading field
 */
const _renderSkeletonField = (index: number): ReactElement => (
  <div key={index} className="grid min-w-0 grid-cols-[minmax(6rem,38%)_minmax(0,1fr)] items-start gap-3 border-b border-border-default/60 py-3 last:border-b-0 sm:block">
    <span className="h-5 w-20 rounded-3xl bg-background-subtle sm:h-4" />
    <span className="h-6 w-28 justify-self-end rounded-3xl bg-background-subtle sm:mt-1 sm:h-5 sm:justify-self-start" />
  </div>
);

/**
 * Render loading section with the same header and field grid as detail content.
 * @param {number} fieldCount - Number of description fields
 * @param {string} label - Section label
 * @param {boolean} [isWide] - Expand fields across desktop width
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
 * Render loading quotation identity and dates.
 * @returns {ReactElement} Overview skeleton
 */
const _renderSkeletonOverview = (): ReactElement => (
  <section className="min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small sm:p-6">
    <div className="h-4 w-20 rounded-3xl bg-background-subtle" />
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <div className="h-8 w-40 rounded-3xl bg-background-subtle" />
      <div className="h-7 w-24 rounded-full bg-background-subtle" />
      <div className="h-7 w-32 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 grid grid-cols-1 gap-x-8 border-t border-border-default sm:mt-5 sm:grid-cols-3">
      {Array.from({ length: 3 }, (_value, index) => _renderSkeletonField(index))}
    </div>
  </section>
);

/**
 * Render loading rental lines.
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
 * Render loading pricing breakdown and total.
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
 * Render quotation detail loading state at the loaded page breakpoints.
 * @returns {ReactElement} Responsive detail skeleton
 */
const _renderDetailSkeleton = (): ReactElement => (
  <div className="w-full space-y-4 pb-32 sm:space-y-4 lg:pb-8" role="status" aria-label="Loading quotation detail">
    <div className="animate-pulse" aria-hidden="true">
      {_renderSkeletonOverview()}
      <div className="mt-4 space-y-4 sm:mt-4 sm:space-y-4">
        {_renderSkeletonSection(12, "Loading transaction and event", true)}
        {_renderSkeletonSection(1, "Loading global remark")}
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
 * Resolve approval button label.
 * @param {boolean} isApproved - Approved state
 * @param {boolean} isApproving - Approval loading state
 * @returns {string} Button label
 */
const _getApproveLabel = (isApproved: boolean, isApproving: boolean): string => {
  if (isApproved) return "Approved";

  if (isApproving) return "Approving...";

  return "Approve";
};

/**
 * Render approval button label and disabled state.
 * @param {QuotationDetailState} props - Detail state
 * @param {number} status - Quotation status
 * @returns {{approveLabel: string; isApproved: boolean}} Approval presentation
 */
const _getApprovalPresentation = (
  props: QuotationDetailState,
  status: number,
): { approveLabel: string; isApproved: boolean } => {
  const isApproved = status === 2;

  return { approveLabel: _getApproveLabel(isApproved, props.isApproving), isApproved };
};

/**
 * Render desktop quotation header actions.
 * @param {QuotationDetailState} props - Detail state
 * @param {string} approveLabel - Approval label
 * @param {boolean} isApproved - Approved state
 * @param {() => void} handleDownloadPdf - PDF handler
 * @returns {ReactElement} Desktop actions
 */
const _renderDesktopActions = (
  props: QuotationDetailState,
  approveLabel: string,
  isApproved: boolean,
  handleDownloadPdf: () => void,
): ReactElement => (
  <div className="hidden items-center gap-3 lg:flex" data-testid="quotation-detail-desktop-actions">
    {props.quotation?.status === 1 && (
      <button type="button" onClick={props.handleEdit} className="inline-flex h-11 items-center gap-2 rounded-3xl border border-border-default px-4 text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle">
        <FiEdit2 className="h-5 w-5" aria-hidden="true" />
        Edit
      </button>
    )}
    <button type="button" onClick={props.openApproveModal} disabled={isApproved || props.isApproving} className="inline-flex h-11 items-center gap-2 rounded-3xl bg-success-strong px-4 text-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
      <FiCheckCircle className="h-5 w-5" aria-hidden="true" />
      {approveLabel}
    </button>
    <button type="button" onClick={handleDownloadPdf} className="inline-flex h-11 items-center gap-2 rounded-3xl bg-action-primary px-4 text-lg font-semibold text-white transition-opacity hover:opacity-90">
      <FiDownload className="h-5 w-5" aria-hidden="true" />
      Download PDF
    </button>
  </div>
);

/**
 * Render mobile quotation header action menu.
 * @param {QuotationDetailState} props - Detail state
 * @param {string} approveLabel - Approval label
 * @param {boolean} isApproved - Approved state
 * @param {() => void} handleDownloadPdf - PDF handler
 * @returns {ReactElement} Mobile actions
 */
const _renderMobileActions = (
  props: QuotationDetailState,
  approveLabel: string,
  isApproved: boolean,
  handleDownloadPdf: () => void,
): ReactElement => (
  <div className="lg:hidden">
    <ActionMenu testId="quotation-detail-actions" icon={<FiMoreHorizontal className="h-7 w-7" aria-hidden="true" />}>
      {props.quotation?.status === 1 && (
        <button type="button" role="menuitem" onClick={props.handleEdit} className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle">
          <FiEdit2 className="h-5 w-5" aria-hidden="true" />
          Edit
        </button>
      )}
      <button type="button" role="menuitem" onClick={props.openApproveModal} disabled={isApproved || props.isApproving} className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-lg font-semibold text-success-strong transition-colors hover:bg-success-subtle disabled:cursor-not-allowed disabled:opacity-60">
        <FiCheckCircle className="h-5 w-5" aria-hidden="true" />
        {approveLabel}
      </button>
      <button type="button" role="menuitem" onClick={handleDownloadPdf} className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle">
        <FiDownload className="h-5 w-5" aria-hidden="true" />
        Download PDF
      </button>
    </ActionMenu>
  </div>
);

/**
 * Render quotation header actions.
 * @param {QuotationDetailState} props - Detail state
 * @returns {ReactElement | null} Header actions
 */
const _renderHeaderActions = (props: QuotationDetailState): ReactElement | null => {
  const quotation = props.quotation;

  if (!quotation) return null;

  const { approveLabel, isApproved } = _getApprovalPresentation(props, quotation.status);
  /** Download current quotation PDF. */
  const handleDownloadPdf = (): void => {
    void generateQuotationPDF(quotationToQuoteData(quotation, props.itemCategories));
  };

  return (
    <>
      {_renderDesktopActions(props, approveLabel, isApproved, handleDownloadPdf)}
      {_renderMobileActions(props, approveLabel, isApproved, handleDownloadPdf)}
    </>
  );
};

/**
 * Render quotation detail page.
 * @param {QuotationDetailState} props - Detail state
 * @returns {ReactElement} Quotation detail page
 */
export const QuotationDetailComponent = (props: QuotationDetailState): ReactElement => {
  const headerActions = _renderHeaderActions(props);

  return (
    <Layout pageTitle="Quotation Detail">
      <PageLayout title="Quotation Detail" subtitle="View quotation details and transaction information" breadcrumbs={["Quotation", "Detail"]} headerRight={headerActions} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.goBack}>
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {props.isLoading && _renderDetailSkeleton()}
          {!props.isLoading && props.errorMessage && <div role="alert" className="rounded-3xl border border-danger bg-danger-subtle p-5 text-lg font-medium text-danger-strong">{props.errorMessage}</div>}
          {!props.isLoading && !props.errorMessage && !props.quotation && <div className="rounded-3xl border border-border-default bg-background-surface p-8 text-center text-lg text-text-secondary">Quotation detail is unavailable.</div>}
          {!props.isLoading && !props.errorMessage && props.quotation && _renderDetail(props.quotation)}
        </div>
      </PageLayout>
      <ConfirmModal
        isOpen={props.isConfirmOpen}
        onClose={props.closeApproveModal}
        onConfirm={(): void => { void props.handleApprove(); }}
        title="Approve quotation?"
        message="This will mark this quotation as approved."
        confirmText={props.isApproving ? "Approving..." : "Approve"}
        isDestructive={false}
      />
    </Layout>
  );
};
