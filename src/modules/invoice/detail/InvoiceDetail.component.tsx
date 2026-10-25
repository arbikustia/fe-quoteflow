import type { ReactElement } from "react";

import Layout from "@/app/layout";

import type { InvoiceDetailState } from "../Invoice.type";

const _value = (value: string | number): string => String(value || "-");

const _renderFields = (title: string, fields: [string, string | number][]): ReactElement => (
  <section className="overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-small">
    <div className="px-5 pb-3 pt-5"><h2 className="text-sm font-semibold text-text-primary">{title}</h2></div>
    <dl className="grid grid-cols-1 divide-y divide-border-default sm:grid-cols-2 sm:divide-x sm:divide-y-0">
      {fields.map(([label, value]) => <div key={label} className="px-5 py-4"><dt className="mb-1 text-sm text-text-secondary">{label}</dt><dd className="text-sm font-medium text-text-primary">{_value(value)}</dd></div>)}
    </dl>
  </section>
);

const _renderDetails = (invoice: NonNullable<InvoiceDetailState["invoice"]>): ReactElement => {
  const quotation = invoice.quotation;
  const transaction = quotation.transaction;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border-default bg-background-surface p-5 text-center shadow-small">
        <h2 className="mb-2 text-xl font-semibold text-text-primary">{invoice.invoice_no}</h2>
        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${invoice.status === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{invoice.status === 1 ? "Active" : "Inactive"}</span>
      </div>
      {_renderFields("Invoice Info", [["Invoice No", invoice.invoice_no], ["Invoice Date", invoice.invoice_date], ["Due Date", invoice.due_date], ["Notes", invoice.notes], ["Status", invoice.status]])}
      {_renderFields("Quotation Reference", [["Quotation No", quotation.quotation_no], ["Quotation Date", quotation.quotation_date], ["Expired At", quotation.expired_at]])}
      {_renderFields("Transaction & Event", [["Event Name", transaction.event_name], ["Service Type", transaction.service_type_name], ["Start Date", transaction.start_at], ["End Date", transaction.end_at], ["Subtotal", transaction.subtotal], ["Service Fee", transaction.service_fee], ["Discount", transaction.discount], ["Grand Total", transaction.grand_total]])}
      {_renderFields("Related Entities", [["Customer", transaction.customer.name], ["Customer Address", transaction.customer.address ?? "-"], ["Customer Phone", transaction.customer.phone_number ?? "-"], ["PIC", transaction.pic.name], ["Voucher", transaction.voucher.name], ["Voucher Code", transaction.voucher.code ?? "-"]])}
      <section className="overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-small"><div className="px-5 pb-3 pt-5"><h2 className="text-sm font-semibold text-text-primary">Items</h2></div><div className="divide-y divide-border-default">{transaction.rental_transaction_items.length === 0 ? <p className="px-5 py-4 text-sm text-text-secondary">No items selected.</p> : transaction.rental_transaction_items.map((item) => <div key={item.item_id} className="flex items-center justify-between px-5 py-4 text-sm"><span className="font-medium text-text-primary">{item.item_name}</span><span className="text-text-secondary">Qty: {item.qty} · Subtotal: {item.subtotal.toLocaleString("id-ID")}</span></div>)}</div></section>
      {transaction.rental_transaction_project.map((project) => <section key={project.id} className="overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-small"><div className="px-5 pb-3 pt-5"><h2 className="text-sm font-semibold text-text-primary">Project: {project.name}</h2><p className="text-sm text-text-secondary">{project.remark || "-"} · Qty: {project.qty}</p></div><div className="divide-y divide-border-default">{project.items.map((item) => <div key={item.id} className="flex items-center justify-between px-5 py-4 text-sm"><span className="font-medium text-text-primary">{item.item_name}</span><span className="text-text-secondary">Qty: {item.qty}</span></div>)}</div></section>)}
    </div>
  );
};

/** Render invoice detail page. */
export const InvoiceDetailComponent = (props: InvoiceDetailState): ReactElement => {
  if (props.isLoading) return <Layout pageTitle="Detail Invoice"><div className="flex h-full items-center justify-center py-20"><p className="text-text-secondary">Loading invoice…</p></div></Layout>;
  if (props.errorMessage || !props.invoice) return <Layout pageTitle="Detail Invoice"><div className="flex h-full items-center justify-center py-20"><p className="text-red-600">{props.errorMessage ?? "Invoice not found"}</p></div></Layout>;

  return <Layout pageTitle="Detail Invoice"><div className="relative space-y-4 px-3 lg:px-0"><div className="flex items-center justify-between py-2"><button type="button" onClick={props.goBack} className="h-11 rounded-lg border border-border-default px-4 text-sm font-medium">Back</button><h1 className="text-lg font-semibold">Detail Invoice</h1><span /></div>{_renderDetails(props.invoice)}</div></Layout>;
};