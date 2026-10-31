import type { ReactElement } from "react";
import { FiCheckCircle } from "react-icons/fi";

import ConfirmModal from "@/components/ConfirmModal";
import { SkeletonComponent } from "@/components/Skeleton";

import type { ApiQuotation, QuotationDetailState } from "../Quotation.type";

import {
  renderCustomerSection,
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
          {renderCustomerSection(quotation.transaction.customer)}
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
export const QuotationDetailComponent = (props: QuotationDetailState): ReactElement => {
  const isApproved = props.quotation?.status === 3;
  const approveLabel = _getApproveLabel(isApproved, props.isApproving);
  const approveButton = (
    <button
      type="button"
      onClick={props.openApproveModal}
      disabled={!props.quotation || isApproved || props.isApproving}
      className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed lg:h-12 lg:gap-2 lg:px-5 ${isApproved ? "border border-success bg-success-subtle text-success-strong" : "bg-action-primary text-text-inverse shadow-xs hover:bg-action-primary-hover active:bg-action-primary-pressed disabled:opacity-60"}`}
    >
      <FiCheckCircle className="h-4 w-4 lg:h-5 lg:w-5" aria-hidden="true" />
      <span>{approveLabel}</span>
    </button>
  );

  return (
    <Layout pageTitle="Quotation Detail" mobileWhiteBackground={true}>
      <PageLayout title="Quotation Detail" breadcrumbs={["Quotation", "Detail"]} headerRight={approveButton} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.goBack}>
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
