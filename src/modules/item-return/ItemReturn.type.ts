export type StagedPhoto = { file: File; url: string };

export type ApiReturnItem = {
  id: string;
  return_id: string;
  item_id: string;
  item_name?: string;
  category_name?: string;
  customer_name?: string;
  qty: number;
  condition: string;
  notes: string;
  file_url: string;
  file_name: string;
  file_urls?: string[];
  file_names?: string[];
  images?: {
    file_url: string;
    file_name: string;
  }[];
  status: number;
  created_at: string;
  updated_at: string;
};

export type ApiReturn = {
  id: string;
  order_id: string;
  return_date: string;
  notes: string;
  status: number | null;
  created_at: string;
  updated_at: string;
  items: ApiReturnItem[];
};

export type ReturnListResponse = {
  status: boolean;
  data: ApiReturn[];
  messages: string[];
  page_number: number;
  total_pages: number;
  page_size: number;
  total_count: number;
  has_previous: boolean;
  has_next: boolean;
};

export type ReturnListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

export type ReturnItemPayload = {
  return_id?: string;
  item_id: string;
  qty: number;
  condition: string;
  notes: string;
  file_url: string;
  file_name: string;
  images: {
    file_url: string;
    file_name: string;
  }[];
  status: number;
};

export type ReturnCreatePayload = {
  order_id: string;
  return_date?: string;
  notes?: string;
  status: number;
  items: ReturnItemPayload[];
};

export type ReturnCreateResponse = {
  status: boolean;
  data: ApiReturn | null;
  messages: string[];
};

export type ReturnDetailResponse = {
  status: boolean;
  data: ApiReturn | null;
  messages: string[];
};

export type ReturnUpdateRequest = {
  id: string;
  body: ReturnCreatePayload;
};

export type ReturnRow = {
  id: string;
  customerName: string;
  returnDate: string;
  itemCount: number;
  notes: string;
  status: "active" | "inactive" | "unavailable";
};

export type ItemReturnMobileCardProps = {
  row: ReturnRow;
  onClick: (row: ReturnRow) => void;
};

export type ReturnListState = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  rows: ReturnRow[];
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  setSearchTerm: (value: string) => void;
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  onCreate: () => void;
  onEdit: (row: ReturnRow) => void;
  onRowClick: (row: ReturnRow) => void;
  onBack: () => void;
};
