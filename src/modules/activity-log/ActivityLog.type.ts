export type ApiActivityLog = {
  id: string;
  user_name: string;
  action: string;
  page: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type ActivityLogListResponse = {
  status: boolean;
  data: ApiActivityLog[];
  messages: string[];
  page_number: number;
  total_pages: number;
  page_size: number;
  total_count: number;
  has_previous: boolean;
  has_next: boolean;
};

export type ActivityLogListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

export type ActivityLogData = {
  id: string;
  userName: string;
  action: string;
  page: string;
  description: string;
  createdAt: string;
};

export type ActivityLogCardProps = {
  activity: ActivityLogData;
};

export type ActivityLogProps = ActivityLogPagination & {
  onBack: () => void;
};

export type ActivityLogPageData = {
  paginatedData: ActivityLogData[];
  totalPages: number;
  totalCount: number;
};

export type ActivityLogPagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: ActivityLogData[];
  totalCount: number;
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (value: string) => void;
};
