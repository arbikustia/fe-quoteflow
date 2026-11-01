import type { ApiInvoice } from "@/modules/invoice/Invoice.type";

export type ApiRentalOrder = {
  id: string;
  transaction_id: string;
  invoice_id: string;
  quotation_id: string;
  order_no: string;
  order_date: string;
  notes: string | null;
  status: number;
  created_at: string;
  updated_at: string;
  invoice: ApiInvoice;
};

export type RentalOrderListResponse = {
  status: boolean;
  data: ApiRentalOrder[];
  messages: string[] | null;
  page_number: number;
  total_pages: number;
  page_size: number;
  total_count: number;
  has_previous: boolean;
  has_next: boolean;
};

export type RentalOrderListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
};

export type DashboardRentalOrderParams = {
  dateFrom: string;
  dateTo: string;
};

export type DashboardRentalOrderData = {
  date_from: string;
  date_to: string;
  total_orders: number;
  total_amount: number;
};

export type DashboardRentalOrderResponse = {
  status: boolean;
  data: DashboardRentalOrderData;
  messages: string[];
};

export type ReportOrderData = {
  id: string;
  orderNo: string;
  transactionId: string;
  invoiceNo: string;
  customerName: string;
  customerPhone: string;
  eventName: string;
  address: string;
  orderDate: string;
  startDate: string;
  endDate: string;
  grandTotal: number;
  status: number;
  statusLabel: "active" | "inactive";
  serviceTypeName: string;
  orderTypeName: string;
};

export type ReportOrderApiState = {
  isLoading: boolean;
  errorMessage: string | null;
  isEnvelopeError: boolean;
  isMissingData: boolean;
  paginatedData: ReportOrderData[];
  totalPages: number;
  totalCount: number;
};

export type ReportOrderPagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: ReportOrderData[];
  totalCount: number;
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  isMissingData: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (value: string) => void;
};

export type ReportOrderProps = ReportOrderPagination & {
  onBack: () => void;
  onRowClick?: (order: ReportOrderData) => void;
};

export type OrderMobileCardProps = {
  order: ReportOrderData;
  onRowClick?: (order: ReportOrderData) => void;
};
