export type QuotationInfoSection = {
  quotationNo: string;
  quotationDate: string;
  expiredAt: string;
  notes: string;
  statusText: string;
  isActive: boolean;
};

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

export type CustomerSummary = {
  name: string;
  phone: string;
  address: string;
  statusText: string;
};

export type PicSummary = {
  name: string;
  statusText: string;
};

export type VoucherSummary = {
  name: string;
  code: string;
  discountPercent: string;
  statusText: string;
};

export type ItemRow = {
  id: string;
  name: string;
  qty: number;
  price: string;
  subtotal: string;
  remark: string;
};

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
