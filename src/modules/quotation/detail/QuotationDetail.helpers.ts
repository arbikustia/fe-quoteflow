import type {
  ApiQuotation,
  ApiQuotationCustomer,
  ApiQuotationItem,
  ApiQuotationProject,
  ApiQuotationReference,
  ApiQuotationTransaction,
} from "../Quotation.type";

import type {
  CustomerSummary,
  ItemRow,
  PicSummary,
  ProjectSection,
  QuotationInfoSection,
  QuotationTxSummary,
  VoucherSummary,
} from "./QuotationDetail.type";

/**
 * formatCurrency.
 * @param {number} amount - amount value.
 * @returns {string} - result.
 */
export const formatCurrency = (amount: number): string => `Rp ${amount.toLocaleString("id-ID")}`;

/**
 * formatDate.
 * @param {string} dateString - dateString value.
 * @returns {string} - result.
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);

  return Number.isNaN(date.getTime()) ? dateString : date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * getStatusLabel.
 * @param {number} status - status value.
 * @returns {string} - result.
 */
export const getStatusLabel = (status: number): string => (status === 1 ? "Active" : "Inactive");

/**
 * Get quotation workflow status label.
 * @param {number} status - Quotation status value
 * @returns {string} Quotation workflow status label
 */
export const getQuotationStatusLabel = (status: number): string => {
  if (status === 1) return "Quotation Created";

  if (status === 2) return "Approved";

  if (status === 0) return "Cancelled";

  return "-";
};

/**
 * Get invoice workflow status label.
 * @param {number} status - Invoice status value
 * @returns {string} Invoice workflow status label
 */
export const getInvoiceStatusLabel = (status: number): string => {
  if (status === 1) return "Invoice Created";

  if (status === 2) return "Approved";

  if (status === 0) return "Cancelled";

  return "-";
};

/**
 * Get workflow status badge CSS class.
 * @param {number} status - Status value
 * @returns {string} Badge CSS class
 */
export const getStatusBadgeClass = (status: number): string => {
  if (status === 2) return "bg-success-subtle text-success-strong";

  if (status === 1) return "bg-warning-subtle text-warning-strong";

  if (status === 0) return "bg-danger-subtle text-danger-strong";

  return "bg-background-muted text-text-tertiary";
};

/**
 * mapQuotationInfo.
 * @param {ApiQuotation} data - data value.
 * @returns {QuotationInfoSection} - result.
 */
export const mapQuotationInfo = (data: ApiQuotation): QuotationInfoSection => ({
  quotationNo: data.quotation_no,
  quotationDate: formatDate(data.quotation_date),
  expiredAt: formatDate(data.expired_at),
  notes: data.notes || "-",
  statusText: getQuotationStatusLabel(data.status),
  isActive: data.status === 1,
});

/**
 * mapQuotationTx.
 * @param {ApiQuotationTransaction} tx - tx value.
 * @returns {QuotationTxSummary} - result.
 */
export const mapQuotationTx = (tx: ApiQuotationTransaction): QuotationTxSummary => ({
  eventName: tx.event_name, serviceTypeName: tx.service_type_name || "-", startAt: formatDate(tx.start_at), endAt: formatDate(tx.end_at),
  subtotal: formatCurrency(tx.subtotal), serviceFee: formatCurrency(tx.service_fee), discount: formatCurrency(tx.discount), grandTotal: formatCurrency(tx.grand_total),
});

/**
 * mapCustomerSummary.
 * @param {ApiQuotationCustomer} customer - customer value.
 * @returns {CustomerSummary} - result.
 */
export const mapCustomerSummary = (customer: ApiQuotationCustomer): CustomerSummary => ({ name: customer.name, phone: customer.phone_number || "-", address: customer.address || "-", statusText: getStatusLabel(customer.status) });

/**
 * mapPicSummary.
 * @param {ApiQuotationReference} pic - pic value.
 * @returns {PicSummary} - result.
 */
export const mapPicSummary = (pic: ApiQuotationReference): PicSummary => ({ name: pic.name, statusText: getStatusLabel(pic.status) });

/**
 * mapVoucherSummary.
 * @param {ApiQuotationReference} voucher - voucher value.
 * @returns {VoucherSummary} - result.
 */
export const mapVoucherSummary = (voucher: ApiQuotationReference): VoucherSummary => ({ name: voucher.name, code: voucher.code || "-", discountPercent: voucher.discount_percent ? `${voucher.discount_percent}%` : "-", statusText: getStatusLabel(voucher.status) });

/**
 * mapItemRows.
 * @param {ApiQuotationItem[]} items - items value.
 * @returns {ItemRow[]} - result.
 */
export const mapItemRows = (items: ApiQuotationItem[]): ItemRow[] => items.map((item) => ({ id: item.item_id, name: item.item_name || item.item_id, qty: item.qty, price: formatCurrency(item.price), subtotal: formatCurrency(item.subtotal), remark: item.remark || "-" }));

/**
 * mapProjectSections.
 * @param {ApiQuotationProject[]} projects - projects value.
 * @returns {ProjectSection[]} - result.
 */
export const mapProjectSections = (projects: ApiQuotationProject[]): ProjectSection[] => projects.map((project) => ({
  id: project.id, name: project.name, remark: project.remark || "-", qty: project.qty, subtotal: formatCurrency(project.subtotal),
  items: project.items.map((item) => ({ id: item.id, name: item.item_name || item.item_id, qty: item.qty, price: formatCurrency(item.price) })),
}));
