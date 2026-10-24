import type { ReactElement } from "react";

import Layout from "@/app/layout";

import type { OrderDetailProps } from "./OrderDetail.type";

const _formatDate = (value: string): string => value ? new Date(value).toLocaleString("id-ID") : "—";
const _formatCurrency = (value: number): string => `Rp ${value.toLocaleString("id-ID")}`;

const _renderState = (props: OrderDetailProps): ReactElement | null => {
  if (props.isLoading) return <p className="py-20 text-center text-text-secondary">Loading order detail…</p>;
  if (props.errorMessage) return <p className="py-20 text-center text-danger">{props.errorMessage}</p>;
  if (!props.order) return <p className="py-20 text-center text-text-secondary">Order not found.</p>;

  return null;
};

export const OrderDetailComponent = (props: OrderDetailProps): ReactElement => {
  const state = _renderState(props);

  if (state) {
    return <Layout pageTitle="Order Detail"><div className="flex h-full flex-col px-3 lg:px-0 lg:-mt-4">{state}</div></Layout>;
  }

  const order = props.order;

  if (!order) return <Layout pageTitle="Order Detail"><div /></Layout>;

  return (
    <Layout pageTitle="Order Detail">
      <div className="flex h-full flex-col px-3 pb-18 lg:-mt-4 lg:px-0 lg:pb-0">
        <div className="flex items-center gap-3 py-2 lg:mb-4">
          <button type="button" onClick={props.onNavigateBack} aria-label="Back" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary hover:bg-background-subtle">
            ←
          </button>
          <h1 className="truncate text-xl font-semibold text-text-primary">Order Detail</h1>
        </div>
        <div className="space-y-4 pb-24">
          <section className="rounded-3xl border border-border-default bg-background-surface p-5 shadow-xs">
            <h2 className="mb-4 text-lg font-semibold text-text-primary">{order.event_name}</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div><dt className="text-sm text-text-secondary">Customer</dt><dd className="font-semibold text-text-primary">{order.customer_name}</dd></div>
              <div><dt className="text-sm text-text-secondary">Phone</dt><dd className="font-semibold text-text-primary">{order.customer_phone}</dd></div>
              <div><dt className="text-sm text-text-secondary">Address</dt><dd className="font-semibold text-text-primary">{order.address}</dd></div>
              <div><dt className="text-sm text-text-secondary">Service type</dt><dd className="font-semibold text-text-primary">{order.service_type_name}</dd></div>
              <div><dt className="text-sm text-text-secondary">Start</dt><dd className="font-semibold text-text-primary">{_formatDate(order.start_at)}</dd></div>
              <div><dt className="text-sm text-text-secondary">End</dt><dd className="font-semibold text-text-primary">{_formatDate(order.end_at)}</dd></div>
            </dl>
          </section>
          <section className="overflow-hidden rounded-3xl border border-border-default bg-background-surface shadow-xs">
            <div className="border-b border-border-default px-5 py-4"><h2 className="font-semibold text-text-primary">Rental items</h2></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left"><thead className="bg-table-header text-sm text-text-secondary"><tr><th className="px-5 py-3">Item</th><th className="px-5 py-3">Qty</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Subtotal</th><th className="px-5 py-3">Remark</th></tr></thead><tbody className="divide-y divide-border-default">{order.rental_transaction_items.map((item) => <tr key={item.item_id}><td className="px-5 py-3 font-medium text-text-primary">{item.item_name}</td><td className="px-5 py-3 text-text-secondary">{item.qty}</td><td className="px-5 py-3 text-text-secondary">{_formatCurrency(item.price)}</td><td className="px-5 py-3 text-text-secondary">{_formatCurrency(item.subtotal)}</td><td className="px-5 py-3 text-text-secondary">{item.remark}</td></tr>)}</tbody></table></div>
          </section>
          <section className="rounded-3xl border border-border-default bg-background-surface p-5 shadow-xs">
            <h2 className="mb-4 font-semibold text-text-primary">Summary</h2>
            <dl className="ml-auto max-w-sm space-y-3 text-sm"><div className="flex justify-between"><dt className="text-text-secondary">Subtotal</dt><dd className="font-medium text-text-primary">{_formatCurrency(order.subtotal)}</dd></div><div className="flex justify-between"><dt className="text-text-secondary">Service fee</dt><dd className="font-medium text-text-primary">{_formatCurrency(order.service_fee)}</dd></div><div className="flex justify-between"><dt className="text-text-secondary">Discount</dt><dd className="font-medium text-text-primary">{_formatCurrency(order.discount)}</dd></div><div className="flex justify-between border-t border-border-default pt-3 text-base"><dt className="font-semibold text-text-primary">Grand total</dt><dd className="font-bold text-action-primary">{_formatCurrency(order.grand_total)}</dd></div></dl>
          </section>
        </div>
      </div>
    </Layout>
  );
};
