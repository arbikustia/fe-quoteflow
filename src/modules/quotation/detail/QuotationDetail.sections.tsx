import type { ReactElement, ReactNode } from "react";

import type {
  ApiQuotation,
  ApiQuotationCustomer,
  ApiQuotationItem,
  ApiQuotationProject,
  ApiQuotationReference,
  ApiQuotationTransaction,
} from "../Quotation.type";

import { formatCurrency, formatDate, getStatusLabel } from "./QuotationDetail.helpers";

/**
 * Render labeled value.
 * @param {string} label - Field label
 * @param {ReactNode} value - Field value
 * @returns {ReactElement} Description item
 */
const _renderField = (label: string, value: ReactNode): ReactElement => (
  <div className="grid min-w-0 grid-cols-[minmax(7rem,40%)_minmax(0,1fr)] items-start gap-2 border-b border-border-default/60 py-3 last:border-b-0 sm:block sm:py-4">
    <dt className="text-sm font-medium leading-5 text-text-secondary sm:mb-1 sm:text-xs sm:font-semibold sm:uppercase sm:tracking-wide sm:text-text-tertiary">
      {label}
    </dt>
    <dd className="break-words text-right text-base font-medium leading-6 text-text-primary sm:text-left sm:text-sm sm:font-medium">
      {value}
    </dd>
  </div>
);

/**
 * Render status badge.
 * @param {number} status - Numeric status
 * @returns {ReactElement} Status badge
 */
const _renderStatus = (status: number): ReactElement => (
  <span
    className={`inline-flex rounded-full px-3.5 py-1 text-sm font-bold uppercase sm:px-3 sm:py-0.5 sm:text-xs ${status === 1 ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}
  >
    {getStatusLabel(status)}
  </span>
);

/**
 * Render section shell.
 * @param {string} title - Section title
 * @param {ReactNode} children - Section content
 * @returns {ReactElement} Section
 */
const _renderSection = (title: string, children: ReactNode): ReactElement => (
  <section className="min-w-0 overflow-hidden rounded-2xl border border-border-default bg-background-surface shadow-xs">
    <header className="border-b border-border-default/80 bg-background-subtle/40 px-4 py-3.5 sm:px-6 sm:py-4">
      <h2 className="text-lg font-bold tracking-tight text-text-primary sm:text-base sm:font-semibold">
        {title}
      </h2>
    </header>
    <div className="px-4 py-1 sm:px-6 sm:py-0">{children}</div>
  </section>
);

/**
 * Render quotation overview.
 * @param {ApiQuotation} quotation - Quotation response
 * @returns {ReactElement} Overview section
 */
export const renderQuotationOverview = (quotation: ApiQuotation): ReactElement => (
  <section className="min-w-0 rounded-2xl border border-border-default bg-background-surface p-4 shadow-xs sm:p-5 lg:p-6">
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Quotation</p>
        <h2 className="mt-1 break-words text-2xl font-bold tracking-tight text-text-primary sm:text-2xl lg:text-3xl">
          {quotation.quotation_no}
        </h2>
        <div className="mt-3 flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-border-default bg-background-subtle px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Service Type</span>
          <span className="break-words text-sm font-bold text-text-primary">{quotation.transaction.service_type_name}</span>
        </div>
      </div>
      <span className="inline-flex w-fit shrink-0 rounded-full bg-warning-subtle px-3 py-1 text-xs font-bold uppercase text-warning-strong sm:text-xs">
        QUOTATION SENT
      </span>
    </div>
    <dl className="mt-4 grid grid-cols-1 gap-x-8 border-t border-border-default sm:mt-5 sm:grid-cols-2 lg:grid-cols-4">
      {_renderField("Quotation Date", formatDate(quotation.quotation_date))}
      {_renderField("Expired At", formatDate(quotation.expired_at))}
      {_renderField("Notes", quotation.notes)}
      {_renderField("Created At", formatDate(quotation.created_at))}
      {_renderField("Updated At", formatDate(quotation.updated_at))}
    </dl>
  </section>
);

/**
 * Render transaction section.
 * @param {ApiQuotationTransaction} transaction - Transaction response
 * @returns {ReactElement} Transaction section
 */
export const renderTransactionSection = (transaction: ApiQuotationTransaction): ReactElement =>
  _renderSection(
    "Transaction & Event",
    <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
      {_renderField("Service Type", transaction.service_type_name)}
      {_renderField("Customer Name", transaction.customer_name)}
      {_renderField("Customer Phone", transaction.customer_phone)}
      {_renderField("PIC", transaction.pic?.name)}
      {_renderField("Address", transaction.address)}
      {_renderField("Event Name", transaction.event_name)}
      {_renderField("Event Start", formatDate(transaction.start_at))}
      {_renderField("Event End", formatDate(transaction.end_at))}
      {_renderField("Status", _renderStatus(transaction.status))}
      {_renderField("Created At", formatDate(transaction.created_at))}
      {_renderField("Updated At", formatDate(transaction.updated_at))}
    </dl>,
  );

/**
 * Render pricing section.
 * @param {ApiQuotationTransaction} transaction - Transaction response
 * @returns {ReactElement} Pricing section
 */
export const renderPricingSection = (transaction: ApiQuotationTransaction): ReactElement =>
  _renderSection(
    "Pricing Summary",
    <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
      {_renderField("Subtotal", formatCurrency(transaction.subtotal))}
      {_renderField("Service Fee", formatCurrency(transaction.service_fee))}
      {_renderField("Discount", formatCurrency(transaction.discount))}
      <div className="mx-0 my-3 rounded-2xl border border-action-primary/30 bg-action-primary-subtle/40 p-4 sm:col-span-2 sm:my-2 sm:flex sm:items-center sm:justify-between sm:rounded-xl sm:border-0 sm:bg-transparent sm:p-0">
        <dt className="text-base font-bold uppercase tracking-wider text-action-primary sm:text-xs sm:font-semibold sm:tracking-wide sm:text-text-tertiary">
          Grand Total
        </dt>
        <dd className="mt-1 text-right text-3xl font-extrabold tabular-nums text-action-primary sm:mt-0 sm:text-2xl sm:font-bold">
          {formatCurrency(transaction.grand_total)}
        </dd>
      </div>
    </dl>,
  );

/**
 * Render customer section.
 * @param {ApiQuotationCustomer} customer - Customer response
 * @returns {ReactElement} Customer section
 */
export const renderCustomerSection = (customer: ApiQuotationCustomer): ReactElement =>
  _renderSection(
    "Customer",
    <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
      {_renderField("Name", customer.name)}
      {_renderField("Phone Number", customer.phone_number)}
      {_renderField("Address", customer.address)}
      {_renderField("Status", _renderStatus(customer.status))}
      {_renderField("Created At", formatDate(customer.created_at))}
      {_renderField("Updated At", formatDate(customer.updated_at))}
    </dl>,
  );

/**
 * Render reference section.
 * @param {string} title - Section title
 * @param {ApiQuotationReference} reference - Reference response
 * @returns {ReactElement} Reference section
 */
export const renderReferenceSection = (
  title: string,
  reference: ApiQuotationReference,
): ReactElement =>
  _renderSection(
    title,
    <dl>
      {_renderField("Name", reference.name)}
    </dl>,
  );

/**
 * Render voucher section.
 * @param {ApiQuotationReference} voucher - Voucher response
 * @returns {ReactElement} Voucher section
 */
export const renderVoucherSection = (voucher: ApiQuotationReference): ReactElement =>
  _renderSection(
    "Voucher",
    <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
      {_renderField("Name", voucher.name)}
      {_renderField(
        "Discount",
        voucher.discount_percent !== undefined ? `${voucher.discount_percent}%` : "-",
      )}
    </dl>,
  );

/**
 * Render rental item row.
 * @param {ApiQuotationItem} item - Rental item
 * @returns {ReactElement} Rental item row
 */
const _renderItem = (item: ApiQuotationItem): ReactElement => (
  <article
    key={item.item_id}
    className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border-default/70 py-4 last:border-b-0"
  >
    <div className="min-w-0">
      <h3 className="break-words text-xl font-bold text-text-primary sm:text-base sm:font-semibold">
        {item.item_name}
      </h3>
      <p className="mt-1 text-base font-medium text-text-secondary sm:text-sm">
        {formatCurrency(item.price)}
      </p>
      {item.remark && (
        <p className="mt-2 text-base text-text-secondary sm:text-sm">{item.remark}</p>
      )}
    </div>
    <dl className="grid shrink-0 gap-2 text-right">
      <div>
        <dt className="sr-only">Qty</dt>
        <dd>
          <span className="inline-flex rounded-xl bg-action-primary-subtle px-3 py-1 text-sm font-bold tabular-nums text-action-primary sm:rounded-lg sm:bg-background-subtle sm:px-2 sm:text-xs sm:font-semibold sm:text-text-secondary">
            Qty {item.qty}
          </span>
        </dd>
      </div>
      <div>
        <dt className="text-sm font-medium text-text-tertiary sm:text-xs">Subtotal</dt>
        <dd className="text-xl font-bold tabular-nums text-text-primary sm:text-base sm:font-semibold">
          {formatCurrency(item.subtotal)}
        </dd>
      </div>
    </dl>
  </article>
);

/**
 * Render rental items section.
 * @param {ApiQuotationItem[]} items - Rental items
 * @returns {ReactElement} Rental items section
 */
export const renderItemsSection = (items: ApiQuotationItem[]): ReactElement =>
  _renderSection(
    "Rental Items",
    items.length === 0 ? (
      <p className="py-5 text-base text-text-secondary sm:text-sm">No rental items.</p>
    ) : (
      <div>{items.map(_renderItem)}</div>
    ),
  );

/**
 * Render project section.
 * @param {ApiQuotationProject} project - Rental project
 * @returns {ReactElement} Project section
 */
// eslint-disable-next-line max-lines-per-function
const _renderProject = (project: ApiQuotationProject): ReactElement => (
  <article key={project.id} className="border-b border-border-default/70 py-5 last:border-b-0">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h3 className="text-xl font-bold text-text-primary sm:text-base sm:font-semibold">
          {project.name}
        </h3>
      </div>
      <strong className="text-xl font-bold tabular-nums text-action-primary sm:text-base sm:text-text-primary">
        {formatCurrency(project.subtotal)}
      </strong>
    </div>
    {project.remark && (
      <p className="mt-2 text-base text-text-secondary sm:text-sm">{project.remark}</p>
    )}
    <div className="mt-2.5">
      <span className="inline-flex rounded-lg bg-action-primary-subtle px-2.5 py-1 text-xs font-bold uppercase text-action-primary">
        Quantity: {project.qty}
      </span>
    </div>
    <div className="mt-3.5 overflow-hidden rounded-xl border border-border-default bg-background-subtle/40">
      {project.items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-border-default/60 px-4 py-3 text-base sm:text-sm last:border-b-0"
        >
          <div>
            <p className="font-semibold text-text-primary sm:font-medium">{item.item_name}</p>
            <p className="mt-1 text-sm font-medium text-text-secondary">
              {formatCurrency(item.price)}
            </p>
          </div>
          <div className="text-right text-text-secondary">
            <span className="inline-flex rounded-md bg-background-surface px-2 py-0.5 text-sm font-semibold tabular-nums text-text-primary sm:text-xs">
              Qty: {item.qty}
            </span>
          </div>
        </div>
      ))}
    </div>
  </article>
);

/**
 * Render rental projects section.
 * @param {ApiQuotationProject[]} projects - Rental projects
 * @returns {ReactElement} Rental projects section
 */
export const renderProjectsSection = (projects: ApiQuotationProject[]): ReactElement =>
  _renderSection(
    "Rental Projects",
    projects.length === 0 ? (
      <p className="py-5 text-base text-text-secondary sm:text-sm">No rental projects.</p>
    ) : (
      <div>{projects.map(_renderProject)}</div>
    ),
  );
