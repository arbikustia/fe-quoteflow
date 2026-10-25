import type {
  ApiQuotation,
  ApiQuotationCustomer,
  ApiQuotationItem,
  ApiQuotationProject,
  ApiQuotationReference,
  ApiQuotationTransaction,
} from "../Quotation.type";

export const formatCurrency = (amount: number): string => `Rp ${amount.toLocaleString("id-ID")}`;

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

export const getStatusLabel = (status: number): string => (status === 1 ? "Active" : "Inactive");

export type QuotationInfoSection = {
  quotationNo: string;
  quotationDate: string;
  expiredAt: string;
  notes: string;
  statusText: string;
  isActive: boolean;
};

export const mapQuotationInfo = (data: ApiQuotation): QuotationInfoSection => ({
  quotationNo: data.quotation_no,
  quotationDate: formatDate(data.quotation_date),
  expiredAt: formatDate(data.expired_at),
  notes: data.notes || "-",
  statusText: getStatusLabel(data.status),
  isActive: data.status === 1,
});

export type QuotationTxSummary = {
  eventName: string;
  serviceTypeName: string;
  startAt: string;
  endAt: string;
  subtotal: string;
  serviceFee: string;
  discount: string;
  grandTotal: string;
};

export const mapQuotationTx = (tx: ApiQuotationTransaction): QuotationTxSummary => ({
  eventName: tx.event_name,
  serviceTypeName: tx.service_type_name || "-",
  startAt: formatDate(tx.start_at),
  endAt: formatDate(tx.end_at),
  subtotal: formatCurrency(tx.subtotal),
  serviceFee: formatCurrency(tx.service_fee),
  discount: formatCurrency(tx.discount),
  grandTotal: formatCurrency(tx.grand_total),
});

export type CustomerSummary = {
  name: string;
  phone: string;
  address: string;
  statusText: string;
};

export const mapCustomerSummary = (customer: ApiQuotationCustomer): CustomerSummary => ({
  name: customer.name,
  phone: customer.phone_number || "-",
  address: customer.address || "-",
  statusText: getStatusLabel(customer.status),
});

export type PicSummary = {
  name: string;
  statusText: string;
};

export const mapPicSummary = (pic: ApiQuotationReference): PicSummary => ({
  name: pic.name,
  statusText: getStatusLabel(pic.status),
});

export type VoucherSummary = {
  name: string;
  code: string;
  discountPercent: string;
  statusText: string;
};

export const mapVoucherSummary = (voucher: ApiQuotationReference): VoucherSummary => ({
  name: voucher.name,
  code: voucher.code || "-",
  discountPercent: voucher.discount_percent ? `${voucher.discount_percent}%` : "-",
  statusText: getStatusLabel(voucher.status),
});

export type ItemRow = {
  id: string;
  name: string;
  qty: number;
  price: string;
  subtotal: string;
  remark: string;
};

export const mapItemRows = (items: ApiQuotationItem[]): ItemRow[] =>
  items.map((item) => ({
    id: item.item_id,
    name: item.item_name || item.item_id,
    qty: item.qty,
    price: formatCurrency(item.price),
    subtotal: formatCurrency(item.subtotal),
    remark: item.remark || "-",
  }));

export type ProjectItemRow = {
  id: string;
  name: string;
  qty: number;
  price: string;
};

export type ProjectSection = {
  id: string;
  name: string;
  remark: string;
  qty: number;
  subtotal: string;
  items: ProjectItemRow[];
};

export const mapProjectSections = (projects: ApiQuotationProject[]): ProjectSection[] =>
  projects.map((project) => ({
    id: project.id,
    name: project.name,
    remark: project.remark || "-",
    qty: project.qty,
    subtotal: formatCurrency(project.subtotal),
    items: project.items.map((item) => ({
      id: item.id,
      name: item.item_name || item.item_id,
      qty: item.qty,
      price: formatCurrency(item.price),
    })),
  }));
