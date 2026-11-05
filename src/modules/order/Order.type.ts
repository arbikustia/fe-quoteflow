export type ApiRentalTransactionItem = {
  item_id: string;
  project_id: string;
  item_name: string;
  qty: number;
  price: number;
  subtotal: number;
  remark: string;
};

export type ApiRentalTransaction = {
  id: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  event_name: string;
  start_at: string;
  end_at: string;
  grand_total: number;
  status: number;
  created_at: string;
  rental_transaction_items?: ApiRentalTransactionItem[];
};

export type OrderListResponse = {
  status: boolean;
  data?: ApiRentalTransaction[];
  messages: string[];
  page_number: number;
  total_pages: number;
  page_size: number;
  total_count: number;
  has_previous: boolean;
  has_next: boolean;
};

export type OrderListParams = {
  pageNumber: number;
  pageSize: number;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  searchTerm: string;
};

export type QuotePdfItem = {
  name: string;
  category: string;
  qty: number;
  price: number;
  remark: string;
};

export type QuotePdfProjectItem = {
  name: string;
  qty: number;
  remark: string;
};

export type QuotePdfProject = {
  name: string;
  qty: number;
  price: number;
  remark: string;
  items: QuotePdfProjectItem[];
};

export type QuoteData = {
  id: string;
  name: string;
  customerName?: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  selectedItems: string[];
  pdfItems?: QuotePdfItem[];
  pdfProjects?: QuotePdfProject[];
  qty: number;
  pph: number;
  discount: number;
  serviceFee?: number;
  remark: string;
  grandTotal: number;
  status: number;
  customerPhone: string;
};

export type CategoryDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  quote: QuoteData | null;
};

export type ItemDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  quote: QuoteData | null;
};

export type BaseOrderState = {
  canCreateOrder: boolean;
  openCreateModal: () => void;
  openEditModal: (quote: QuoteData) => void;
  onRowClick: (quote: QuoteData) => void;
  onBack: () => void;
};

export type OrderProps = BaseOrderState & {
  paginatedData: QuoteData[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (searchTerm: string) => void;
  onRowClick: (quote: QuoteData) => void;
};

export type ApiRentalTransactionDetailItem = {
  item_id: string;
  project_id?: string | null;
  item_name: string;
  qty: number;
  price: number;
  subtotal: number;
  remark: string;
};

export type ApiRentalTransactionProjectItem = {
  id: string;
  item_id: string;
  item_name: string;
  qty: number;
  price: number;
  remark: string;
};

export type ApiRentalTransactionProject = {
  id: string;
  name: string;
  remark: string;
  price: number;
  qty: number;
  subtotal: number;
  items: ApiRentalTransactionProjectItem[];
};

export type ApiRentalTransactionDetail = {
  id: string;
  customer_id?: string;
  pic_id?: string;
  voucher_id?: string;
  customer?: { id: string; name?: string; address?: string; phone_number?: string; phone?: string };
  pic?: { id: string; name?: string };
  voucher?: { id: string; name?: string };
  service_type_id: string;
  service_type_name: string;
  service_type?: { id: string; name?: string };
  order_type_id?: string;
  order_type?: { id: string; name?: string };
  customer_name: string;
  customer_phone: string;
  address: string;
  event_name: string;
  start_at: string;
  end_at: string;
  subtotal: number;
  service_fee: number;
  discount: number;
  remark?: string;
  remarks?: string;
  grand_total: number;
  status: number;
  created_at: string;
  updated_at: string;
  rental_transaction_items: ApiRentalTransactionDetailItem[];
  rental_transaction_project: ApiRentalTransactionProject[];
  rental_handovers?: Array<{
    id: string;
    order_type_id: string;
    type: string;
    name: string;
    status: number;
  }>;
};

export type OrderDetailResponse = {
  status: boolean;
  data: ApiRentalTransactionDetail;
  messages: string[];
};

export type OrderItemPayload = {
  item_id: string;
  project_id: string | null;
  item_name: string;
  qty: number;
  price: number;
  subtotal: number;
  remark: string;
};

export type ProjectOrderItemPayload = {
  project_id: string;
  qty: number;
  price: number;
  subtotal: number;
  remark: string;
};

export type OrderType = {
  id: string;
  name: string;
  is_handover: boolean;
  status: number;
  created_at: string;
  updated_at: string;
};

export type RentalHandoverPayload = {
  order_type_id: string;
  type: string;
  name: string;
  status: number;
};

export type ProjectOrderCreatePayload = {
  customer_id: string;
  pic_id: string;
  voucher_id: string;
  service_type_id: string;
  order_type_id: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  event_name: string;
  start_at: string;
  end_at: string;
  subtotal: number;
  discount: number;
  service_fee: number;
  remarks: string;
  grand_total: number;
  status: number;
  rental_transaction_items: ProjectOrderItemPayload[];
  rental_handover?: RentalHandoverPayload;
};

export type OrderCreateResponse = {
  status: boolean;
  data: OrderCreatePayload | null;
  messages: string[];
};

export type UpdateOrderRequest = {
  id: string;
  payload: OrderCreatePayload;
};

export type OrderCreatePayload = {
  customer_id: string;
  pic_id: string;
  voucher_id: string;
  service_type_id: string;
  order_type_id: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  event_name: string;
  start_at: string;
  end_at: string;
  subtotal: number;
  discount: number;
  service_fee: number;
  remarks: string;
  grand_total: number;
  status: number;
  rental_transaction_items: OrderItemPayload[];
  rental_handover?: RentalHandoverPayload;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  openEditModal: (quote: QuoteData) => void;
};
