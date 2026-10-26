import type { ReactElement } from "react";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import type { OrderDetailProps } from "./OrderDetail.type";

const _formatDate = (value: string): string => value ? new Date(value).toLocaleString("id-ID") : "—";
const _formatCurrency = (value: number): string => `Rp ${value.toLocaleString("id-ID")}`;

/**
 * Render detail loading and error state.
 * @param {OrderDetailProps} props - Detail props
 * @returns {ReactElement | null} State element
 */
const _renderState = (props: OrderDetailProps): ReactElement | null => {
  if (props.isLoading) return <p className="py-20 text-center text-sm text-text-secondary">Loading order detail…</p>;
  if (props.errorMessage) return <p className="py-20 text-center text-sm text-danger">{props.errorMessage}</p>;
  if (!props.order) return <p className="py-20 text-center text-sm text-text-secondary">Order not found.</p>;

  return null;
};

/**
 * Render order information section.
 * @param {OrderDetailProps} props - Detail props
 * @returns {ReactElement} Information section
 */
const _renderInformation = (props: OrderDetailProps): ReactElement => {
  const order = props.order;

  if (!order) return <div />;

  return <section className="rounded-2xl border border-border-default bg-background-surface p-5 lg:p-6"><div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-base font-bold uppercase tracking-wider text-text-tertiary lg:text-xs">Order information</p><h2 className="mt-1 text-2xl font-semibold text-text-primary lg:text-xl">{order.event_name}</h2></div><span className="rounded-full bg-action-primary-subtle px-3 py-1 text-xs font-bold uppercase tracking-wider text-action-primary">Status {order.status}</span></div><dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"><div><dt className="text-xs font-medium uppercase tracking-wider text-text-tertiary">Customer</dt><dd className="mt-1 break-words font-medium text-text-primary">{order.customer_name || "—"}</dd></div><div><dt className="text-xs font-medium uppercase tracking-wider text-text-tertiary">Phone</dt><dd className="mt-1 break-words font-medium text-text-primary">{order.customer_phone || "—"}</dd></div><div><dt className="text-xs font-medium uppercase tracking-wider text-text-tertiary">Service type</dt><dd className="mt-1 break-words font-medium text-text-primary">{order.service_type_name || "—"}</dd></div><div><dt className="text-xs font-medium uppercase tracking-wider text-text-tertiary">Address</dt><dd className="mt-1 break-words font-medium text-text-primary">{order.address || "—"}</dd></div><div><dt className="text-xs font-medium uppercase tracking-wider text-text-tertiary">Start</dt><dd className="mt-1 font-medium text-text-primary">{_formatDate(order.start_at)}</dd></div><div><dt className="text-xs font-medium uppercase tracking-wider text-text-tertiary">End</dt><dd className="mt-1 font-medium text-text-primary">{_formatDate(order.end_at)}</dd></div></dl></section>;
};

/**
 * Render rental items section.
 * @param {OrderDetailProps} props - Detail props
 * @returns {ReactElement} Rental items section
 */
const _renderItems = (props: OrderDetailProps): ReactElement => {
  const order = props.order;

  if (!order) return <div />;

  return <section className="rounded-2xl border border-border-default bg-background-surface p-5 lg:p-6"><div className="mb-4 flex items-center justify-between"><div><p className="text-base font-bold uppercase tracking-wider text-text-tertiary lg:text-xs">Line items</p><h2 className="mt-1 text-2xl font-semibold text-text-primary lg:text-lg">Rental items</h2></div><span className="text-lg text-text-secondary lg:text-sm">{order.rental_transaction_items.length} items</span></div><div className="space-y-3">{order.rental_transaction_items.map((item) => <article key={item.item_id} className="grid gap-3 rounded-xl border border-border-default p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"><div className="min-w-0"><h3 className="break-words font-medium text-text-primary">{item.item_name}</h3><p className="mt-1 text-sm text-text-secondary">Qty {item.qty} · {_formatCurrency(item.price)}{item.remark && ` · ${item.remark}`}</p></div><p className="font-semibold text-text-primary sm:text-right">{_formatCurrency(item.subtotal)}</p></article>)}</div></section>;
};

/**
 * Render order financial summary.
 * @param {OrderDetailProps} props - Detail props
 * @returns {ReactElement} Summary section
 */
const _renderSummary = (props: OrderDetailProps): ReactElement => {
  const order = props.order;

  if (!order) return <div />;

  return <section className="rounded-2xl border border-border-default bg-background-surface p-5 lg:p-6"><p className="text-base font-bold uppercase tracking-wider text-text-tertiary lg:text-xs">Amount</p><h2 className="mt-1 text-2xl font-semibold text-text-primary lg:text-lg">Order summary</h2><dl className="mt-5 space-y-3 text-xl lg:text-sm"><div className="flex justify-between gap-4"><dt className="text-text-secondary">Subtotal</dt><dd className="font-medium text-text-primary">{_formatCurrency(order.subtotal)}</dd></div><div className="flex justify-between gap-4"><dt className="text-text-secondary">Service fee</dt><dd className="font-medium text-text-primary">{_formatCurrency(order.service_fee)}</dd></div><div className="flex justify-between gap-4"><dt className="text-text-secondary">Discount</dt><dd className="font-medium text-text-primary">{_formatCurrency(order.discount)}</dd></div><div className="flex justify-between gap-4 border-t border-border-default pt-4 text-base"><dt className="font-semibold text-text-primary">Grand total</dt><dd className="font-bold text-action-primary">{_formatCurrency(order.grand_total)}</dd></div></dl></section>;
};

/**
 * Render order detail page.
 * @param {OrderDetailProps} props - Detail props
 * @returns {ReactElement} Order detail page
 */
export const OrderDetailComponent = (props: OrderDetailProps): ReactElement => {
  const state = _renderState(props);

  if (state) return <Layout pageTitle="Order Detail"><PageLayout title="Order Detail" breadcrumbs={["Order", "Order Detail"]} onBack={props.onNavigateBack}>{state}</PageLayout></Layout>;

  return <Layout pageTitle="Order Detail"><PageLayout title="Order Detail" breadcrumbs={["Order", "Order Detail"]} onBack={props.onNavigateBack} headerRight={<button type="button" onClick={props.onEdit} className="h-11 rounded-xl bg-action-primary px-5 text-sm font-semibold text-text-inverse transition-colors hover:bg-action-primary-hover">Edit Order</button>} mobileHeaderClassName="px-0"><div className="space-y-4 pb-24 lg:space-y-6 lg:pb-0">{_renderInformation(props)}<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-6">{_renderItems(props)}{_renderSummary(props)}</div></div></PageLayout></Layout>;
};
