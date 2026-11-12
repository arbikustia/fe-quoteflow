
export type ApiQuotationItem = {
  item_id?: string;
  project_id?: string;
  item_name?: string;
  category_name?: string;
  qty: number;
  price: number;
  subtotal: number;
  remark?: string;
};

export type ApiQuotationProjectItem = {
  id: string;
  item_id: string;
  item_name: string;
  category_name?: string;
  qty: number;
  price: number;
  remark?: string;
};

export type ApiQuotationProject = {
  id: string;
  name: string;
  remark: string;
  price: number;
  qty: number;
  subtotal: number;
  items: ApiQuotationProjectItem[];
};

export type ApiQuotationCustomer = {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  status: number;
  created_at: string;
  updated_at: string;
};

export type ApiQuotationReference = {
  id: string;
  name: string;
  status: number;
  created_at: string;
  updated_at: string;
  code?: string;
  discount_percent?: number;
};

export type ApiQuotationTransaction = {
  id: string;
  service_type_id: string;
  service_type_name: string;
  order_type_id?: string;
  order_type_name?: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  event_name: string;
  start_at: string;
  end_at: string;
  subtotal: number;
  service_fee: number;
  discount: number;
  remarks?: string | null;
  grand_total: number;
  status: number;
  created_at: string;
  updated_at: string;
  rental_transaction_items: ApiQuotationItem[];
  rental_transaction_project: ApiQuotationProject[];
  rental_handovers: [];
  customer: ApiQuotationCustomer;
  pic: ApiQuotationReference;
  voucher: ApiQuotationReference | null;
};

export type ApiQuotation = {
  id: string;
  transaction_id: string;
  quotation_no: string;
  quotation_date: string;
  expired_at: string;
  notes: string;
  status: number;
  created_at: string;
  updated_at: string;
  transaction: ApiQuotationTransaction;
};

export type QuotationListResponse = {
  status: boolean;
  data: ApiQuotation[];
  messages: string[];
  page_number: number;
  total_pages: number;
  page_size: number;
  total_count: number;
  has_previous: boolean;
  has_next: boolean;
};

export type QuotationListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

export type QuotationAllResponse = {
  status: boolean;
  data: ApiQuotation[];
  messages: string[];
};

export type QuotationUpdatePayload = {
  transaction_id: string;
  quotation_no: string;
  quotation_date: string;
  expired_at: string;
  notes: string;
  status: number;
};

export type QuotationUpdateResponse = {
  status: boolean;
  data: ApiQuotation | null;
  messages: string[];
};

export type QuotationUpdateRequest = {
  id: string;
  payload: QuotationUpdatePayload;
};

export type QuotationApproveRequest = {
  id: string;
};

export type QuotationData = {
  id: string;
  transactionId: string;
  quotationNumber: string;
  customerName: string;
  name: string;
  quotationDate: string;
  customerPhone: string;
  location: string;
  startDate: string;
  endDate: string;
  grandTotal: number;
  status: number;
  items?: ApiQuotationItem[];
};

export type QuotationMobileCardProps = {
  quotation: QuotationData;
  onClick: (quotation: QuotationData) => void;
};

export type QuotationListApiState = {
  isLoading: boolean;
  errorMessage: string | null;
  isMissingData: boolean;
  paginatedData: QuotationData[];
  totalPages: number;
  totalCount: number;
};

export type QuotationPagination = QuotationListApiState & {
  currentPage: number;
  pageSize: number;
  isEmpty: boolean;
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (searchTerm: string) => void;
};

export type QuotationNavigation = {
  onBack: () => void;
  onDownload: (quotation: QuotationData) => Promise<void>;
  onEdit: (quotation: QuotationData) => void;
  onDetail: (quotation: QuotationData) => void;
  onStatus: (quotation: QuotationData) => void;
  onRowClick: (quotation: QuotationData) => void;
};

export type QuotationProps = QuotationPagination & Omit<QuotationNavigation, "onEdit"> & Partial<Pick<QuotationNavigation, "onEdit">>;

export type QuotationDetailResponse = {
  status: boolean;
  data: ApiQuotation | null;
  messages: string[];
};

export type QuotationDetailState = {
  quotation: ApiQuotation | null;
  itemCategories: Map<string, string>;
  isLoading: boolean;
  isApproving: boolean;
  isConfirmOpen: boolean;
  errorMessage: string | null;
  goBack: () => void;
  openApproveModal: () => void;
  closeApproveModal: () => void;
  handleEdit: () => void;
  handleApprove: () => Promise<void>;
};

export type QuotationApprovalState = {
  isApproving: boolean;
  isConfirmOpen: boolean;
  errorMessage?: string;
  openConfirm: () => void;
  closeConfirm: () => void;
  approve: () => Promise<void>;
};
