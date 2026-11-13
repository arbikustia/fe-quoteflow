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

export type RentalOrderResponse = {
  status: boolean;
  data: ApiRentalOrder[];
  messages: string[] | null;
};

export type RentalOrderUpdatePayload = {
  transaction_id: string;
  invoice_id: string;
  quotation_id: string;
  order_no: string;
  order_date: string;
  notes: string;
  status: number;
};

export type RentalOrderUpdateRequest = RentalOrderUpdatePayload & { id: string };

export type RentalOrderUpdateResponse = {
  status: boolean;
  data: ApiRentalOrder | null;
  messages: string[] | null;
};

export type RentalOrderListResponse = RentalOrderResponse & {
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
  invoiceId: string;
  quotationId: string;
  invoiceNo: string;
  notes: string;
  rawOrderDate: string;
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

export type ReportOrderListState = {
  isLoading: boolean;
  errorMessage: string | null;
  isMissingData: boolean;
  paginatedData: ReportOrderData[];
  totalPages: number;
  totalCount: number;
};

export type ReportOrderNavigation = {
  goBack: () => void;
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
  changePageSize: (size: number) => void;
  setSearchTerm: (value: string) => void;
};

export type ReportOrderExport = {
  isExporting: boolean;
  onExport: () => void;
};

export type ReportOrderConfirm = {
  confirmOrder: ReportOrderData | null;
  confirmMessage: string;
  isSubmitting: boolean;
  onEditStatus: (order: ReportOrderData) => void;
  onConfirm: () => void;
  onCancelConfirm: () => void;
};

export type ReportOrderProps = ReportOrderPagination & ReportOrderExport & ReportOrderConfirm & {
  onBack: () => void;
};

export type OrderMobileCardProps = {
  order: ReportOrderData;
  onEditStatus: (order: ReportOrderData) => void;
};
