import type * as React from "react";

import type { ApiInvoice, InvoiceData, InvoiceRowAction } from "./Invoice.type";

import type { QuoteData } from "@/modules/order/Order.type";

/**
 * Get badge CSS class for an invoice payment status (e.g. "Lunas", "Belum Lunas").
 * @param {string} paymentStatus - Payment status label from the API
 * @returns {string} Badge CSS class
 */
export const getPaymentStatusBadgeClass = (paymentStatus: string): string => {
  const normalized = paymentStatus.trim().toLowerCase();

  if (normalized === "lunas") return "bg-success-subtle text-success-strong";

  if (normalized === "belum lunas") return "bg-danger-subtle text-danger-strong";

  if (normalized === "-" || !normalized) return "bg-background-muted text-text-tertiary";

  return "bg-warning-subtle text-warning-strong";
};

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
  remark: invoice.remarks || "",
  grandTotal: invoice.grandTotal,
  status: invoice.status,
  customerPhone: invoice.customerPhone || "-",
});

/**
 * Map invoice items for PDF.
 * @param {ApiInvoice} invoice - API invoice
 * @returns {NonNullable<QuoteData["pdfItems"]>} PDF items
 */
const _mapPdfItems = (invoice: ApiInvoice): NonNullable<QuoteData["pdfItems"]> =>
  invoice.quotation?.transaction?.rental_transaction_items?.map((item) => ({
    name: item.item_name ?? "Unknown item",
    category: item.category_name ?? "Uncategorized",
    qty: item.qty,
    price: item.price,
    remark: item.remark ?? "",
  })) ?? [];

/**
 * Map api invoice to quote data.
 * @param {ApiInvoice} invoice - Api invoice
 * @returns {QuoteData} Quote data
 */
const _fromApiInvoice = (invoice: ApiInvoice): QuoteData => {
  const tx = invoice.quotation?.transaction;

  return {
    id: invoice.invoice_no || invoice.id,
    name: tx?.event_name || tx?.customer_name || "Event",
    startDate: tx?.start_at || invoice.invoice_date,
    endDate: tx?.end_at || invoice.invoice_date,
    location: tx?.address || "-",
    category: tx?.service_type_name || "",
    selectedItems: _mapPdfItems(invoice).map((item) => item.name),
    pdfItems: _mapPdfItems(invoice),
    pdfProjects: tx?.rental_transaction_project.map((project) => ({
      name: project.name,
      qty: project.qty,
      price: project.price,
      remark: project.remark,
      items: project.items.map((item) => ({
        name: item.item_name,
        qty: item.qty,
        remark: item.remark ?? "",
      })),
    })),
    qty: 1,
    pph: 0,
    discount: tx?.discount ?? 0,
    serviceFee: tx?.service_fee ?? 0,
    remark: tx?.remarks || "",
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

/**
 * Calculate invoice table row number.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} index - Zero-based row index
 * @returns {number} Display row number
 */
export const getInvoiceRowNumber = (currentPage: number, pageSize: number, index: number): number => (currentPage - 1) * pageSize + index + 1;

/**
 * Create a row action click handler that does not bubble up to the table row click.
 * @param {InvoiceData} invoice - Invoice of the row
 * @param {InvoiceRowAction} action - Row action callback
 * @returns {(event: React.MouseEvent) => void} - Action button click handler
 */
export const createRowActionHandler = (invoice: InvoiceData, action: InvoiceRowAction): ((event: React.MouseEvent) => void) => (event: React.MouseEvent): void => {
  event.stopPropagation();
  void action(invoice);
};

/**
 * Get the table row key of an invoice.
 * @param {InvoiceData} invoice - Invoice row
 * @returns {string} - Row key
 */
export const getInvoiceRowKey = (invoice: InvoiceData): string => invoice.id;
