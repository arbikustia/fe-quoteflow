export type ApiChecklistItem = {
  id: string;
  checklist_id: string;
  item_id: string;
  item_name: string;
  description: string;
  section: string | null;
  qty: number;
  move_out: boolean;
  move_in: boolean;
  sign: string;
  category_name?: string | null;
  remark: string | null;
  status: number | null;
  created_at: string;
  updated_at: string;
};

export type ApiChecklist = {
  id: string;
  order_id: string;
  checklist_no: string;
  checklist_date: string;
  status: number | null;
  created_at: string;
  updated_at: string;
  items: ApiChecklistItem[];
};

export type ChecklistListResponse = {
  status: boolean;
  data: ApiChecklist[];
  messages: string[];
  page_number: number;
  total_pages: number;
  page_size: number;
  total_count: number;
  has_previous: boolean;
  has_next: boolean;
};

export type ChecklistDetailResponse = { status: boolean; data: ApiChecklist | null; messages: string[] };
export type ChecklistListParams = { pageNumber: number; pageSize: number; searchTerm: string };
export type ChecklistItemPayload = {
  item_id: string;
  description: string;
  qty: number;
  move_out: boolean;
  move_in: boolean;
  sign: string;
};
export type ChecklistCreatePayload = {
  order_id: string;
  checklist_no?: string;
  status: number;
  items: ChecklistItemPayload[];
};
export type ChecklistCreateResponse = { status: boolean; data: ApiChecklist | null; messages: string[] };
export type ChecklistUpdateRequest = { id: string; body: ChecklistCreatePayload };

export type ChecklistRowStatus = "active" | "inactive" | "unavailable";

export type ChecklistRow = {
  id: string;
  checklistNo: string;
  customerName: string;
  checklistDate: string;
  itemCount: number;
  status: ChecklistRowStatus;
  orderId: string;
};

export type ChecklistStatusConfig = {
  label: string;
  className: string;
};

export type ChecklistStatusBadgeProps = {
  status: ChecklistRowStatus;
};

export type ItemChecklistMobileCardProps = {
  row: ChecklistRow;
  onClick: (row: ChecklistRow) => void;
};

export type ChecklistListData = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  rows: ChecklistRow[];
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  setSearchTerm: (value: string) => void;
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
};

export type ChecklistNavigationState = {
  onCreate: () => void;
  onRowClick: (row: ChecklistRow) => void;
  onEdit: (row: ChecklistRow) => void;
  onDownload: (row: ChecklistRow) => void;
  isDownloadingId: string | null;
  onBack: () => void;
};

export type ChecklistListState = ChecklistListData & ChecklistNavigationState;
