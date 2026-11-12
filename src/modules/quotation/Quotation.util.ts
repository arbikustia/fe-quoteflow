import type { ApiQuotation, ApiQuotationItem, ApiQuotationProject, QuotationData } from "./Quotation.type";

import type { QuoteData, QuotePdfProject } from "@/modules/order/Order.type";

/**
 * Map quotation list row to quote data.
 * @param {QuotationData} quotation - Quotation data row
 * @param {Map<string, string>} itemCategories - Item category names by item ID
 * @returns {QuoteData} Quote data
 */
const _fromQuotationData = (quotation: QuotationData, itemCategories: Map<string, string>): QuoteData => ({
  id: quotation.quotationNumber || quotation.id,
  name: quotation.name || quotation.customerName || "Event",
  customerName: quotation.customerName,
  startDate: quotation.startDate,
  endDate: quotation.endDate,
  location: quotation.location || "-",
  category: "",
  selectedItems: quotation.items?.map((item) => item.item_name ?? "") ?? [],
  pdfItems: quotation.items?.map((item) => ({
    name: item.item_name ?? "",
    category: itemCategories.get(item.item_id ?? "") ?? "Uncategorized",
    qty: item.qty,
    price: item.price,
    remark: item.remark ?? "",
  })),
  qty: 1,
  pph: 0,
  discount: 0,
  remark: "",
  grandTotal: quotation.grandTotal,
  status: quotation.status,
  customerPhone: quotation.customerPhone || "-",
});

/**
 * Map quotation project to PDF project row.
 * @param {ApiQuotationProject} project - Quotation project
 * @param {ApiQuotationItem[]} transactionItems - Transaction items for remark lookup
 * @returns {QuoteProjectRow} PDF project row
 */
const _mapPdfProject = (
  project: ApiQuotationProject,
  transactionItems: ApiQuotationItem[],
): QuotePdfProject => ({
  name: project.name,
  qty: project.qty,
  price: project.price,
  remark: project.remark,
  items: (project.items ?? []).map((item) => ({
    name: item.item_name,
    qty: item.qty,
    remark: transactionItems.find(
      (transactionItem) =>
        transactionItem.project_id === project.id &&
        transactionItem.item_id === item.item_id,
    )?.remark ?? "",
  })),
});

/**
 * Map api quotation to quote data.
 * @param {ApiQuotation} quotation - Api quotation
 * @param {Map<string, string>} itemCategories - Item category names by item ID
 * @returns {QuoteData} Quote data
 */
const _fromApiQuotation = (quotation: ApiQuotation, itemCategories: Map<string, string>): QuoteData => {
  const tx = quotation.transaction;
  const transactionItems = tx?.rental_transaction_items ?? [];
  const regularItems = transactionItems.filter(
    (item) => Boolean(item.item_id && item.item_name),
  );

  return {
    id: quotation.quotation_no || quotation.id,
    name: tx?.event_name || tx?.customer_name || "Event",
    customerName: tx?.customer_name,
    startDate: tx?.start_at || quotation.quotation_date,
    endDate: tx?.end_at || quotation.quotation_date,
    location: tx?.address || "-",
    category: tx?.service_type_name || "",
    selectedItems: regularItems.map((item) => item.item_name ?? ""),
    pdfItems: regularItems.map((item) => ({
      name: item.item_name ?? "",
      category: item.category_name ?? itemCategories.get(item.item_id ?? "") ?? "Uncategorized",
      qty: item.qty,
      price: item.price,
      remark: item.remark ?? "",
    })),
    pdfProjects: (tx?.rental_transaction_project ?? []).map((project) =>
      _mapPdfProject(project, transactionItems),
    ),
    qty: 1,
    pph: 0,
    discount: tx?.discount ?? 0,
    serviceFee: tx?.service_fee ?? 0,
    remark: quotation.notes || "",
    grandTotal: tx?.grand_total ?? 0,
    status: quotation.status,
    customerPhone: tx?.customer_phone || "-",
  };
};

/**
 * Convert quotation to quote data for PDF generator.
 * @param {QuotationData | ApiQuotation} quotation - Quotation data or API quotation
 * @param {Map<string, string>} [itemCategories] - Item category names by item ID
 * @returns {QuoteData} Quote data
 */
export const quotationToQuoteData = (quotation: QuotationData | ApiQuotation, itemCategories = new Map<string, string>()): QuoteData => {
  if ("quotationNumber" in quotation) {
    return _fromQuotationData(quotation, itemCategories);
  }

  return _fromApiQuotation(quotation, itemCategories);
};

/**
 * Calculate quotation table row number.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} index - Zero-based row index
 * @returns {number} Display row number
 */
export const getQuotationRowNumber = (currentPage: number, pageSize: number, index: number): number => (currentPage - 1) * pageSize + index + 1;
