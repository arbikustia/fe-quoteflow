export type InvoiceItem = { item_id: string; item_name: string; qty: number; price: number; subtotal: number; remark: string };
export type InvoiceProjectItem = { id: string; item_id: string; item_name: string; qty: number; price: number };
export type InvoiceProject = { id: string; name: string; remark: string; qty: number; subtotal: number; items: InvoiceProjectItem[] };
export type InvoiceEntity = { id: string; name: string; status: number; created_at: string; updated_at: string; address: string; phone_number: string; code?: string; discount_percent?: number };
export type InvoiceTransaction = {
  id: string; service_type_id: string; service_type_name: string; customer_name: string; customer_phone: string; address: string; event_name: string; start_at: string; end_at: string;
  subtotal: number; service_fee: number; discount: number; grand_total: number; status: number; created_at: string; updated_at: string;
  rental_transaction_items: InvoiceItem[]; rental_transaction_project: InvoiceProject[]; customer: InvoiceEntity; pic: InvoiceEntity; voucher: InvoiceEntity;
};
export type InvoiceQuotation = { id: string; transaction_id: string; quotation_no: string; quotation_date: string; expired_at: string; notes: string; status: number; created_at: string; updated_at: string; transaction: InvoiceTransaction };
export type ApiInvoice = {
  id: string; transaction_id: string; invoice_no: string; invoice_date: string; due_date: string; notes: string; status: number; created_at: string; updated_at: string; quotation: InvoiceQuotation;
};
export type InvoiceDetailResponse = { status: boolean; data: ApiInvoice | null; messages: string[] };

export type InvoiceListResponse = {
  status: boolean;
  data: ApiInvoice[];
  messages: string[];
  page_number: number;
  total_pages: number;
  page_size: number;
  total_count: number;
  has_previous: boolean;
  has_next: boolean;
};

export type InvoiceListParams = { pageNumber: number; pageSize: number; searchTerm: string };

export type InvoiceUpdateRequest = { id: string; payload: { transaction_id: string; status: number } };
export type InvoiceUpdateResponse = { status: boolean; data: ApiInvoice | null; messages: string[] };

export type InvoiceData = {
  id: string;
  transactionId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  customerName: string;
  name: string;
  customerPhone: string;
  location: string;
  startDate: string;
  endDate: string;
  grandTotal: number;
  status: number;
  notes: string;
};

export type InvoicePageData = {
  paginatedData: InvoiceData[];
  totalPages: number;
  totalCount: number;
};

export type InvoicePagination = {
  currentPage: number;
  pageSize: number;
  paginatedData: InvoiceData[];
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  isEmpty: boolean;
  errorMessage: string | null;
  setSearchTerm: (value: string) => void;
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
};

export type InvoiceProps = InvoicePagination & {
  onBack: () => void;
  onRowClick: (invoice: InvoiceData) => void;
  onDetail: (invoice: InvoiceData) => void;
  onEdit: (invoice: InvoiceData) => void;
};

export type InvoiceDetailState = {
  invoice: ApiInvoice | null;
  isLoading: boolean;
  errorMessage: string | null;
  goBack: () => void;
};
