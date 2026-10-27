import type { ReactElement } from "react";

import { SkeletonComponent } from "@/components/Skeleton";

import type { ApiInvoice, InvoiceDetailState } from "../Invoice.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";
import { formatDate } from "@/modules/quotation/detail/QuotationDetail.helpers";
import {
  renderCustomerSection,
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
  <section className="rounded-2xl border border-border-default bg-background-surface p-5 shadow-xs lg:p-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Invoice</p>
        <h2 className="mt-1 break-words text-2xl font-semibold tracking-tight text-text-primary lg:text-3xl">{invoice.invoice_no}</h2>
        <p className="mt-2 text-sm font-medium text-text-secondary">Service Type: {invoice.quotation.transaction.service_type_name}</p>
      </div>
      <span className="inline-flex rounded-full bg-success-subtle px-3 py-1 text-xs font-bold uppercase text-success-strong">
        APPROVED
      </span>
    </div>
    <dl className="mt-5 grid grid-cols-1 gap-x-8 border-t border-border-default sm:grid-cols-2 lg:grid-cols-4">
      <div className="border-b border-border-default/60 py-3"><dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-tertiary">Invoice Date</dt><dd className="text-sm font-medium text-text-primary">{formatDate(invoice.invoice_date)}</dd></div>
      <div className="border-b border-border-default/60 py-3"><dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-tertiary">Due Date</dt><dd className="text-sm font-medium text-text-primary">{formatDate(invoice.due_date)}</dd></div>
      <div className="border-b border-border-default/60 py-3"><dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-tertiary">Quotation No</dt><dd className="text-sm font-medium text-text-primary">{invoice.quotation.quotation_no}</dd></div>
      <div className="border-b border-border-default/60 py-3"><dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-tertiary">Notes</dt><dd className="text-sm font-medium text-text-primary">{invoice.notes}</dd></div>
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
    <div className="space-y-5 pb-8">
      {_renderInvoiceOverview(invoice)}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
        <div className="space-y-5">
          {renderTransactionSection(transaction)}
          {serviceTypeName === "REGULER" && renderItemsSection(transaction.rental_transaction_items)}
          {serviceTypeName === "PROJECT" && renderProjectsSection(transaction.rental_transaction_project)}
        </div>
        <aside className="space-y-5">
          {renderPricingSection(transaction)}
          {renderCustomerSection(transaction.customer)}
          {renderVoucherSection(transaction.voucher)}
        </aside>
      </div>
    </div>
  );
};

/**
 * Render invoice detail page.
 * @param {InvoiceDetailState} props - Detail state
 * @returns {ReactElement} Invoice detail page
 */
export const InvoiceDetailComponent = (props: InvoiceDetailState): ReactElement => (
  <Layout pageTitle="Invoice Detail" mobileWhiteBackground={true}>
    <PageLayout title="Invoice Detail" breadcrumbs={["Document", "Invoice", "Detail"]} mobileHeaderClassName="px-0" onBack={props.goBack}>
      {props.isLoading && <div className="rounded-2xl border border-border-default bg-background-surface p-5"><SkeletonComponent rows={8} columns={[{ width: "35%" }, { width: "65%" }]} /></div>}
      {!props.isLoading && props.errorMessage && <div role="alert" className="rounded-2xl border border-danger bg-danger-subtle p-5 text-sm font-medium text-danger-strong">{props.errorMessage}</div>}
      {!props.isLoading && !props.errorMessage && !props.invoice && <div className="rounded-2xl border border-border-default bg-background-surface p-8 text-center text-sm text-text-secondary">Invoice detail is unavailable.</div>}
      {!props.isLoading && !props.errorMessage && props.invoice && _renderDetails(props.invoice)}
    </PageLayout>
  </Layout>
);
