import type { ReactElement } from "react";

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
    <div className="space-y-4 pb-8 sm:space-y-5">
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
 * Render quotation detail page.
 * @param {QuotationDetailState} props - Detail state
 * @returns {ReactElement} Quotation detail page
 */
export const QuotationDetailComponent = (props: QuotationDetailState): ReactElement => {
  const editButton = (
    <button
      type="button"
      onClick={props.goEdit}
      className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-lg font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30"
    >
      Edit
    </button>
  );

  return (
    <Layout pageTitle="Quotation Detail" mobileWhiteBackground={true}>
      <PageLayout title="Quotation Detail" breadcrumbs={["Quotation", "Detail"]} headerRight={editButton} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.goBack}>
      {props.isLoading && <div className="rounded-2xl border border-border-default bg-background-surface p-5"><SkeletonComponent rows={8} columns={[{ width: "35%" }, { width: "65%" }]} /></div>}
      {!props.isLoading && props.errorMessage && <div role="alert" className="rounded-2xl border border-danger bg-danger-subtle p-5 text-sm font-medium text-danger-strong">{props.errorMessage}</div>}
      {!props.isLoading && !props.errorMessage && !props.quotation && <div className="rounded-2xl border border-border-default bg-background-surface p-8 text-center text-sm text-text-secondary">Quotation detail is unavailable.</div>}
      {!props.isLoading && !props.errorMessage && props.quotation && _renderDetail(props.quotation)}
      </PageLayout>
    </Layout>
  );
};
