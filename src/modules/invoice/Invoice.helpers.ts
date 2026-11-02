import type { ApiInvoice, InvoiceData } from "./Invoice.type";

import type { QuoteData } from "@/modules/order/Order.type";

/**
 * Map invoice list row to quote data.
 * @param {InvoiceData} invoice - Invoice data row
 * @returns {QuoteData} Quote data
 */
const _fromInvoiceData = (invoice: InvoiceData): QuoteData => ({
  id: invoice.invoiceNumber || invoice.id,
  name: invoice.name || invoice.customerName || "Event",
  startDate: invoice.startDate,
  endDate: invoice.endDate,
  location: invoice.location || "-",
  category: "",
  selectedItems: [],
  qty: 1,
  pph: 0,
  discount: 0,
  remark: invoice.notes || "",
  grandTotal: invoice.grandTotal,
  status: invoice.status,
  customerPhone: invoice.customerPhone || "-",
});

/**
 * Map api invoice to quote data.
 * @param {ApiInvoice} invoice - Api invoice
 * @returns {QuoteData} Quote data
 */
const _fromApiInvoice = (invoice: ApiInvoice): QuoteData => {
  const tx = invoice.quotation?.transaction;
  const items = tx?.rental_transaction_items?.map((item) => item.item_name) ?? [];

  return {
    id: invoice.invoice_no || invoice.id,
    name: tx?.event_name || tx?.customer_name || "Event",
    startDate: tx?.start_at || invoice.invoice_date,
    endDate: tx?.end_at || invoice.invoice_date,
    location: tx?.address || "-",
    category: tx?.service_type_name || "",
    selectedItems: items,
    qty: 1,
    pph: 0,
    discount: tx?.discount ?? 0,
    remark: invoice.notes || "",
    grandTotal: tx?.grand_total ?? 0,
    status: invoice.status,
    customerPhone: tx?.customer_phone || "-",
  };
};

/**
 * Convert invoice to quote data for PDF generator.
 * @param {InvoiceData | ApiInvoice} invoice - Invoice data or API invoice
 * @returns {QuoteData} Quote data
 */
export const invoiceToQuoteData = (invoice: InvoiceData | ApiInvoice): QuoteData => {
  if ("invoiceNumber" in invoice) {
    return _fromInvoiceData(invoice);
  }

  return _fromApiInvoice(invoice);
};
