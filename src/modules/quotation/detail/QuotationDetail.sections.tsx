import type { ReactElement, ReactNode } from "react";

import type {
  ApiQuotation,
  ApiQuotationItem,
  ApiQuotationProject,
  ApiQuotationReference,
  ApiQuotationTransaction,
} from "../Quotation.type";

import { formatCurrency, formatDate, formatDiscount, getQuotationStatusLabel, getStatusBadgeClass, getStatusLabel } from "./QuotationDetail.helpers";

/**
 * Render labeled value.
 * @param {string} label - Field label
 * @param {ReactNode} value - Field value
 * @returns {ReactElement} Description item
 */
export const renderDetailField = (label: string, value: ReactNode): ReactElement => (
  <div className="grid min-w-0 grid-cols-[minmax(6rem,38%)_minmax(0,1fr)] items-start gap-3 border-b border-border-default/60 py-3 last:border-b-0 sm:block sm:py-3">
    <dt className="text-lg font-medium leading-7 text-text-secondary sm:mb-1 sm:text-lg sm:font-semibold sm:uppercase sm:tracking-wide sm:text-text-tertiary">
      {label}
    </dt>
    <dd className="min-w-0 break-words text-right text-xl font-semibold leading-8 text-text-primary sm:text-left sm:text-lg sm:font-medium">
      {value}
    </dd>
  </div>
);

const _renderField = renderDetailField;

/**
 * Render section shell.
 * @param {string} title - Section title
 * @param {ReactNode} children - Section content
 * @returns {ReactElement} Section
 */
const _renderSection = (title: string, children: ReactNode): ReactElement => (
  <section className="min-w-0 overflow-hidden rounded-3xl border border-border-strong bg-background-surface shadow-small">
    <header className="border-b border-border-default px-5 py-4 sm:px-6">
      <h2 className="text-xl font-bold text-text-primary sm:text-lg sm:font-semibold">
        {title}
      </h2>
    </header>
    <div className="px-5 py-1 sm:px-6 sm:py-0">{children}</div>
  </section>
);

/**
 * Render quotation overview.
 * @param {ApiQuotation} quotation - Quotation response
 * @returns {ReactElement} Overview section
 */
export const renderQuotationOverview = (quotation: ApiQuotation): ReactElement => (
  <section className="min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small sm:p-6">
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="text-lg font-semibold uppercase tracking-widest text-text-tertiary">Quotation</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h2 className="break-all text-2xl font-bold tracking-tight text-text-primary sm:break-words lg:text-3xl">
            {quotation.quotation_no}
          </h2>
          <span className="inline-flex w-fit rounded-full bg-action-primary-subtle px-3.5 py-1 text-lg font-bold uppercase tracking-wide text-action-primary">
            {quotation.transaction.service_type_name}
          </span>
          <span className={`inline-flex w-fit rounded-full px-3.5 py-1 text-lg font-semibold ${getStatusBadgeClass(quotation.status)}`}>
            {getQuotationStatusLabel(quotation.status)}
          </span>
        </div>
      </div>
    </div>
    <dl className="mt-4 grid grid-cols-1 gap-x-8 border-t border-border-default sm:mt-5 sm:grid-cols-2 lg:grid-cols-4">
      {_renderField("Quotation Date", formatDate(quotation.quotation_date))}
      {_renderField("Expired At", formatDate(quotation.expired_at))}
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
    <dl className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
      {_renderField("Service Type", transaction.service_type_name)}
      {transaction.order_type_name && _renderField("Order Type", transaction.order_type_name)}
      {_renderField("Transaction Status", getStatusLabel(transaction.status))}
      {_renderField("Customer Name", transaction.customer_name)}
      {_renderField("Customer Phone", transaction.customer_phone)}
      {_renderField("PIC", transaction.pic?.name)}
      {_renderField("Address", transaction.address)}
      {_renderField("Event Name", transaction.event_name)}
      {_renderField("Event Start", formatDate(transaction.start_at))}
      {_renderField("Event End", formatDate(transaction.end_at))}
      {_renderField("Created At", formatDate(transaction.created_at))}
      {_renderField("Updated At", formatDate(transaction.updated_at))}
    </dl>,
  );

/**
 * Render global quotation remark.
 * @param {string} remark - Quotation global remark
 * @returns {ReactElement} Global remark section
 */
export const renderGlobalRemarkSection = (remark: string): ReactElement =>
  _renderSection(
    "Global Remark",
    <dl>{_renderField("Remark", remark || "-")}</dl>,
  );

/**
 * Render pricing section.
 * @param {ApiQuotationTransaction} transaction - Transaction response
 * @returns {ReactElement} Pricing section
 */
export const renderPricingSection = (transaction: ApiQuotationTransaction): ReactElement =>
  _renderSection(
    "Pricing Summary",
    <dl className="grid grid-cols-1">
      {_renderField("Subtotal", formatCurrency(transaction.subtotal))}
      {_renderField("Service Fee", formatCurrency(transaction.service_fee))}
      {_renderField("Discount", formatDiscount(transaction.subtotal, transaction.discount))}
      {_renderField("Grand Total", formatCurrency(transaction.grand_total))}
    </dl>,
  );

/**
 * Render customer section from quotation detail transaction response.
 * @param {ApiQuotationTransaction} transaction - Quotation detail transaction
 * @returns {ReactElement} Customer section
 */
export const renderCustomerSection = (transaction: ApiQuotationTransaction): ReactElement =>
  _renderSection(
    "Customer",
    <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
      {_renderField("Name", transaction.customer_name)}
      {_renderField("Phone Number", transaction.customer_phone)}
      {_renderField("Address", transaction.address)}
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
      <h3 className="break-words text-xl font-semibold text-text-primary">
        {item.item_name}
      </h3>
      <p className="mt-1 text-lg font-semibold text-text-secondary">
        {formatCurrency(item.price)}
      </p>
      {item.remark && (
        <p className="mt-2 text-lg text-text-secondary">
          <span className="font-semibold text-text-primary">Remark: </span>
          {item.remark}
        </p>
      )}
    </div>
    <dl className="grid shrink-0 gap-2 text-right">
      <div>
        <dt className="sr-only">Qty</dt>
        <dd className="text-lg font-semibold tabular-nums text-text-secondary">
          Qty: {item.qty}
        </dd>
      </div>
      <div>
        <dt className="text-lg font-medium text-text-tertiary">Subtotal</dt>
        <dd className="text-2xl font-bold tabular-nums text-text-primary sm:text-xl">
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
      <p className="py-5 text-lg text-text-secondary">No rental items.</p>
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
        <h3 className="text-xl font-bold text-text-primary">
          {project.name}
        </h3>
        <p className="mt-1 text-lg font-medium text-text-secondary">
          Qty: {project.qty}
        </p>
      </div>
      <strong className="text-xl font-bold tabular-nums text-action-primary sm:text-lg">
        {formatCurrency(project.subtotal)}
      </strong>
    </div>
    {project.remark && (
      <p className="mt-2 text-lg text-text-secondary">{project.remark}</p>
    )}
    <div className="mt-3.5 overflow-hidden rounded-3xl border border-border-default bg-background-subtle/40">
      {project.items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-border-default/60 px-4 py-3 text-lg last:border-b-0"
        >
          <div>
            <p className="font-semibold text-text-primary">{item.item_name}</p>
            <p className="mt-1 text-lg font-medium text-text-secondary">
              {formatCurrency(item.price)}
            </p>
          </div>
          <div className="text-right text-text-secondary">
            <span className="text-lg font-semibold tabular-nums text-text-secondary">
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
      <p className="py-5 text-lg text-text-secondary">No rental projects.</p>
    ) : (
      <div>{projects.map(_renderProject)}</div>
    ),
  );
