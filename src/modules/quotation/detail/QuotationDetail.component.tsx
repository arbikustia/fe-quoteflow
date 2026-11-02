import type { ReactElement } from "react";
import { FiCheckCircle, FiDownload, FiEdit2, FiMoreHorizontal } from "react-icons/fi";

import { generateQuotationPDF } from "@/utils/pdfGenerator";

import ConfirmModal from "@/components/ConfirmModal";
import { SkeletonComponent } from "@/components/Skeleton";

import { quotationToQuoteData } from "../Quotation.helpers";
import type { ApiQuotation, QuotationDetailState } from "../Quotation.type";

import {
  renderItemsSection,
  renderPricingSection,
  renderProjectsSection,
  renderQuotationOverview,
  renderTransactionSection,
  renderVoucherSection,
} from "./QuotationDetail.sections";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

/**
 * Render quotation detail content.
 * @param {ApiQuotation} quotation - Quotation response
 * @returns {ReactElement} Detail sections
 */
const _renderDetail = (quotation: ApiQuotation): ReactElement => {
  const serviceTypeName = quotation.transaction.service_type_name.toUpperCase();
  const isRegular = serviceTypeName === "REGULER";
  const isProject = serviceTypeName === "PROJECT";

  return (
    <div className="space-y-4 pb-32 sm:space-y-5 lg:pb-8">
      {renderQuotationOverview(quotation)}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
        <div className="space-y-4 sm:space-y-5">
          {renderTransactionSection(quotation.transaction)}
          {isRegular && renderItemsSection(quotation.transaction.rental_transaction_items)}
          {isProject && renderProjectsSection(quotation.transaction.rental_transaction_project)}
        </div>
        <aside className="space-y-4 sm:space-y-5">
          {renderPricingSection(quotation.transaction)}
          {renderVoucherSection(quotation.transaction.voucher)}
        </aside>
      </div>
    </div>
  );
};

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
 * Render quotation detail page.
 * @param {QuotationDetailState} props - Detail state
 * @returns {ReactElement} Quotation detail page
 */
// eslint-disable-next-line max-lines-per-function
export const QuotationDetailComponent = (props: QuotationDetailState): ReactElement => {
  const isApproved = props.quotation?.status === 2;
  const approveLabel = _getApproveLabel(isApproved, props.isApproving);

  /**
   * Handle quotation PDF download.
   * @returns {void}
   */
  const handleDownloadPdf = (): void => {
    if (props.quotation) {
      void generateQuotationPDF(quotationToQuoteData(props.quotation));
    }
  };

  const headerActions = props.quotation ? (
    <details className="relative shrink-0">
      <summary data-testid="quotation-detail-actions" className="flex h-14 w-14 cursor-pointer list-none items-center justify-center rounded-2xl border border-border-default text-text-secondary transition-colors hover:bg-background-subtle hover:text-text-primary" aria-label="More options">
        <FiMoreHorizontal className="h-7 w-7" aria-hidden="true" />
      </summary>
      <div role="menu" className="absolute right-0 top-16 z-20 w-56 overflow-hidden rounded-2xl border border-border-default bg-background-surface py-2 shadow-lg">
        {props.quotation.status === 1 && (
          <button type="button" role="menuitem" onClick={props.handleEdit} className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle">
            <FiEdit2 className="h-5 w-5" aria-hidden="true" />
            Edit
          </button>
        )}
        {props.quotation.status === 1 && (
          <button type="button" role="menuitem" onClick={props.openApproveModal} className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-lg font-semibold text-success-strong transition-colors hover:bg-success-subtle">
            <FiCheckCircle className="h-5 w-5" aria-hidden="true" />
            {approveLabel}
          </button>
        )}
        <button type="button" role="menuitem" onClick={handleDownloadPdf} className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle">
          <FiDownload className="h-5 w-5" aria-hidden="true" />
          Download PDF
        </button>
      </div>
    </details>
  ) : null;

  return (
    <Layout pageTitle="Quotation Detail" mobileWhiteBackground={true}>
      <PageLayout title="Quotation Detail" subtitle="View quotation details and transaction information" breadcrumbs={["Quotation", "Detail"]} headerRight={headerActions} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.goBack}>
        {props.isLoading && <div className="rounded-2xl border border-border-default bg-background-surface p-5"><SkeletonComponent rows={8} columns={[{ width: "35%" }, { width: "65%" }]} /></div>}
        {!props.isLoading && props.errorMessage && <div role="alert" className="rounded-2xl border border-danger bg-danger-subtle p-5 text-sm font-medium text-danger-strong">{props.errorMessage}</div>}
        {!props.isLoading && !props.errorMessage && !props.quotation && <div className="rounded-2xl border border-border-default bg-background-surface p-8 text-center text-sm text-text-secondary">Quotation detail is unavailable.</div>}
        {!props.isLoading && !props.errorMessage && props.quotation && _renderDetail(props.quotation)}
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
