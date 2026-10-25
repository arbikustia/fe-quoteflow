import type { ReactElement } from "react";

import type { ApiQuotation, QuotationDetailState } from "../Quotation.type";

import {
  mapCustomerSummary,
  mapItemRows,
  mapPicSummary,
  mapProjectSections,
  mapQuotationInfo,
  mapQuotationTx,
  mapVoucherSummary,
} from "./QuotationDetail.helpers";
import {
  renderEntitiesCard,
  renderHeaderCard,
  renderInfoCard,
  renderProjectsCard,
  renderRentalItemsCard,
  renderTransactionSummary,
} from "./QuotationDetail.sections";

import Layout from "@/app/layout";

/** Render detail cards sections. */
const _renderDetailSections = (quotation: ApiQuotation): ReactElement => {
  const info = mapQuotationInfo(quotation);
  const tx = mapQuotationTx(quotation.transaction);
  const customer = mapCustomerSummary(quotation.transaction.customer);
  const pic = mapPicSummary(quotation.transaction.pic);
  const voucher = mapVoucherSummary(quotation.transaction.voucher);
  const items = mapItemRows(quotation.transaction.rental_transaction_items);
  const projects = mapProjectSections(quotation.transaction.rental_transaction_project);

  return (
    <div className="space-y-4">
      {renderHeaderCard(info)}
      {renderInfoCard(info)}
      {renderTransactionSummary(tx)}
      {renderEntitiesCard(customer, pic, voucher)}
      {renderRentalItemsCard(items)}
      {renderProjectsCard(projects)}
    </div>
  );
};

/** Render loading state. */
const _renderLoading = (): ReactElement => (
  <Layout pageTitle="Detail Quotation">
    <div className="flex h-full items-center justify-center py-20">
      <p className="text-text-secondary">Loading quotation…</p>
    </div>
  </Layout>
);

/** Render error state. */
const _renderError = (errorMessage: string | null): ReactElement => (
  <Layout pageTitle="Detail Quotation">
    <div className="flex h-full items-center justify-center py-20">
      <p className="text-red-600">{errorMessage ?? "Quotation not found"}</p>
    </div>
  </Layout>
);

/** Quotation Detail Pure UI Component. */
export const QuotationDetailComponent = (props: QuotationDetailState): ReactElement => {
  const { quotation, isLoading, errorMessage, goBack } = props;

  if (isLoading) {
    return _renderLoading();
  }

  if (errorMessage || !quotation) {
    return _renderError(errorMessage);
  }

  return (
    <Layout pageTitle="Detail Quotation">
      <div className="relative mx-auto max-w-5xl space-y-4 px-3 pb-8 lg:px-0">
        <div className="flex items-center justify-between py-2">
          <button
            type="button"
            onClick={goBack}
            className="h-11 rounded-lg border border-border-default px-4 text-sm font-medium hover:bg-background-surface-subtle"
          >
            Back
          </button>
          <h1 className="text-lg font-semibold text-text-primary">Detail Quotation</h1>
          <div className="w-16" />
        </div>
        {_renderDetailSections(quotation)}
      </div>
    </Layout>
  );
};
