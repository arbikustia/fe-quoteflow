import type { ReactElement } from "react";

import type { OrderDetailProps } from "./OrderDetail.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

/**
 * Handle module operation.
 * @param {string} value - value value
 * @returns {string} - Operation result
 */
const _formatDate = (value: string): string => {
  if (!value) return "—";

  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

/**
 * Format discount percentage.
 * @param {number} value - discount percentage
 * @returns {string} formatted discount
 */
const _formatDiscount = (value: number): string => `${value}%`;
/**
 * Handle module operation.
 * @param {number} value - value value
 * @returns {string} - Operation result
 */
const _formatCurrency = (value: number): string => `Rp ${value.toLocaleString("id-ID")}`;

/**
 * Format order status label.
 * @param {number} value - status value
 * @returns {string} status label
 */
const _formatStatus = (value: number): string => value === 1 ? "Active" : "Inactive";

/**
 * Get order status classes.
 * @param {number} value - status value
 * @returns {string} status classes
 */
const _getStatusClass = (value: number): string => value === 1 ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong";

/**
 * Handle module operation.
 * @param {OrderDetailProps} props - props value
 * @returns {ReactElement | null} - Operation result
 */
const _renderState = (props: OrderDetailProps): ReactElement | null => {
  if (props.isLoading) return <p className="py-20 text-center text-sm text-text-secondary">Loading order detail…</p>;

  if (props.errorMessage) return <p className="py-20 text-center text-sm text-danger">{props.errorMessage}</p>;

  if (!props.order) return <p className="py-20 text-center text-sm text-text-secondary">Order not found.</p>;

  return null;
};

/**
 * Handle module operation.
 * @param {OrderDetailProps} props - props value
 * @returns {ReactElement} - Operation result
 */
const _renderInformation = (props: OrderDetailProps): ReactElement => {
  const order = props.order;

  if (!order) return <div />;

  return <section className="rounded-2xl border border-border-default bg-background-surface p-5 lg:p-6"><div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-base font-bold uppercase tracking-wider text-text-tertiary lg:text-xs">Order information</p><h2 className="mt-1 text-3xl font-semibold text-text-primary lg:text-xl">{order.event_name}</h2></div><span className={`rounded-full px-3 py-1 text-sm font-bold uppercase tracking-wider lg:text-xs ${_getStatusClass(order.status)}`}>{_formatStatus(order.status)}</span></div><dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"><div><dt className="text-sm font-medium uppercase tracking-wider text-text-tertiary lg:text-xs">Customer</dt><dd className="mt-1 break-words text-xl font-medium text-text-primary lg:text-base">{order.customer_name || "—"}</dd></div><div><dt className="text-sm font-medium uppercase tracking-wider text-text-tertiary lg:text-xs">Phone</dt><dd className="mt-1 break-words text-xl font-medium text-text-primary lg:text-base">{order.customer_phone || "—"}</dd></div><div><dt className="text-sm font-medium uppercase tracking-wider text-text-tertiary lg:text-xs">Service type</dt><dd className="mt-1 break-words text-xl font-medium text-text-primary lg:text-base">{order.service_type_name || "—"}</dd></div><div><dt className="text-sm font-medium uppercase tracking-wider text-text-tertiary lg:text-xs">Address</dt><dd className="mt-1 break-words text-xl font-medium text-text-primary lg:text-base">{order.address || "—"}</dd></div><div><dt className="text-sm font-medium uppercase tracking-wider text-text-tertiary lg:text-xs">Start</dt><dd className="mt-1 text-xl font-medium text-text-primary lg:text-base">{_formatDate(order.start_at)}</dd></div><div><dt className="text-sm font-medium uppercase tracking-wider text-text-tertiary lg:text-xs">End</dt><dd className="mt-1 text-xl font-medium text-text-primary lg:text-base">{_formatDate(order.end_at)}</dd></div></dl></section>;
};

/**
 * Handle module operation.
 * @param {OrderDetailProps} props - props value
 * @returns {ReactElement} - Operation result
 */
const _renderItems = (props: OrderDetailProps): ReactElement => {
  const order = props.order;
  const isProjectService = order?.service_type_name.trim().toUpperCase() === "PROJECT";

  if (!order) return <div />;

  if (isProjectService) return <section className="rounded-2xl border border-border-default bg-background-surface p-5 lg:p-6"><div className="mb-4 flex items-center justify-between"><div><p className="text-base font-bold uppercase tracking-wider text-text-tertiary lg:text-xs">Line items</p><h2 className="mt-1 text-3xl font-semibold text-text-primary lg:text-lg">Rental projects</h2></div><span className="text-xl text-text-secondary lg:text-sm">{order.rental_transaction_project.length} projects</span></div><div className="space-y-3">{order.rental_transaction_project.map((rentalProject) => { const project = props.projects.find((item) => item.id === rentalProject.id); const items = project?.items ?? rentalProject.items; return <article key={rentalProject.id} className="overflow-hidden rounded-xl border border-border-default"><div className="flex items-start justify-between gap-3 border-b border-border-default bg-background-subtle px-4 py-3"><div className="min-w-0"><h3 className="break-words text-xl font-medium text-text-primary lg:text-base">{project?.name ?? rentalProject.name}</h3>{rentalProject.remark && <p className="mt-1 break-words text-lg text-text-secondary lg:text-sm">{rentalProject.remark}</p>}</div><p className="shrink-0 text-xl font-semibold text-text-primary lg:text-base">{_formatCurrency(rentalProject.subtotal)}</p></div><div className="divide-y divide-border-default">{items.map((item) => <div key={item.item_id} className="flex items-center justify-between gap-3 px-4 py-3"><p className="min-w-0 break-words text-lg font-medium text-text-primary lg:text-sm">{item.item_name ?? item.item_id}</p><span className="shrink-0 text-lg text-text-secondary lg:text-sm">Qty {item.qty}</span></div>)}</div></article>; })}</div></section>;

  return <section className="rounded-2xl border border-border-default bg-background-surface p-5 lg:p-6"><div className="mb-4 flex items-center justify-between"><div><p className="text-base font-bold uppercase tracking-wider text-text-tertiary lg:text-xs">Line items</p><h2 className="mt-1 text-3xl font-semibold text-text-primary lg:text-lg">Rental items</h2></div><span className="text-xl text-text-secondary lg:text-sm">{order.rental_transaction_items.length} items</span></div><div className="space-y-3">{order.rental_transaction_items.map((item) => <article key={item.item_id} className="grid gap-3 rounded-xl border border-border-default p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"><div className="min-w-0"><h3 className="break-words text-xl font-medium text-text-primary lg:text-base">{item.item_name}</h3><p className="mt-1 text-lg text-text-secondary lg:text-sm">Qty {item.qty} · {_formatCurrency(item.price)}{item.remark && ` · ${item.remark}`}</p></div><p className="text-xl font-semibold text-text-primary lg:text-base sm:text-right">{_formatCurrency(item.subtotal)}</p></article>)}</div></section>;
};

/**
 * Handle module operation.
 * @param {OrderDetailProps} props - props value
 * @returns {ReactElement} - Operation result
 */
const _renderSummary = (props: OrderDetailProps): ReactElement => {
  const order = props.order;

  if (!order) return <div />;

  return <section className="rounded-2xl border border-border-default bg-background-surface p-5 lg:p-6"><p className="text-base font-bold uppercase tracking-wider text-text-tertiary lg:text-xs">Amount</p><h2 className="mt-1 text-3xl font-semibold text-text-primary lg:text-lg">Order summary</h2><dl className="mt-5 space-y-4 text-2xl lg:space-y-3 lg:text-sm"><div className="flex justify-between gap-4"><dt className="text-text-secondary">Subtotal</dt><dd className="font-medium text-text-primary">{_formatCurrency(order.subtotal)}</dd></div><div className="flex justify-between gap-4"><dt className="text-text-secondary">Service fee</dt><dd className="font-medium text-text-primary">{_formatCurrency(order.service_fee)}</dd></div><div className="flex justify-between gap-4"><dt className="text-text-secondary">Discount</dt><dd className="font-medium text-text-primary">{_formatDiscount(order.discount)}</dd></div><div className="flex justify-between gap-4 border-t border-border-default pt-4 text-2xl lg:text-base"><dt className="font-semibold text-text-primary">Grand total</dt><dd className="font-bold text-action-primary">{_formatCurrency(order.grand_total)}</dd></div></dl></section>;
};

/**
 * Handle module operation.
 * @param {OrderDetailProps} props - props value
 * @returns {ReactElement} - Operation result
 */
export const OrderDetailComponent = (props: OrderDetailProps): ReactElement => {
  const state = _renderState(props);

  if (state) return <Layout pageTitle="Order Detail" whiteBackground={true}><PageLayout title="Order Detail" breadcrumbs={["Order", "Order Detail"]} onBack={props.onNavigateBack}>{state}</PageLayout></Layout>;

  return <Layout pageTitle="Order Detail" whiteBackground={true}><PageLayout title="Order Detail" breadcrumbs={["Order", "Order Detail"]} onBack={props.onNavigateBack} headerRight={<button type="button" onClick={props.onEdit} className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-lg font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30">Edit</button>} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl"><div className="space-y-4 pb-24 lg:space-y-6 lg:pb-0">{_renderInformation(props)}<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-6">{_renderItems(props)}{_renderSummary(props)}</div></div></PageLayout></Layout>;
};
