import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";

export type ApiCategory = {
  id: string;
  category_name: string;
  status: number;
  created_at: string | null;
  created_by: string | null;
  updated_at: string | null;
};

export type CategoryListResponse = PaginatedResponse<ApiCategory>;
export type CategoryCreateResponse = ApiEnvelope<ApiCategory | null>;
export type CategoryDetailResponse = ApiEnvelope<ApiCategory | null>;

export type CategoryListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

export type CategoryData = {
  id: string;
  categoryName: string;
  status: "active" | "inactive";
  createAt: string | null;
  createBy: string | null;
};

export type CategoryListApiState = {
  isLoading: boolean;
  errorMessage: string | null;
  isEnvelopeError: boolean;
  isMissingData: boolean;
  paginatedData: CategoryData[];
  totalPages: number;
  totalCount: number;
};

export type CategoryCreatePayload = {
  category_name: string;
  status: number;
};

export type CategoryUpdatePayload = CategoryCreatePayload & {
  id: string;
};

export type CategoryAllItem = {
  id: string;
  category_name: string;
};

export type CategoryAllResponse = ApiEnvelope<CategoryAllItem[]>;

export type CategorySelectState = {
  categories: CategoryAllItem[];
  isLoading: boolean;
  errorMessage: string | null;
};

export type MasterCategoryNavigation = {
  goBack: () => void;
  goCreate: () => void;
  goEdit: (category: CategoryData) => void;
};

export type MasterCategoryPagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: CategoryData[];
  totalCount: number;
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  isMissingData: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (searchTerm: string) => void;
};

export type MasterCategoryContainerState = {
  pagination: MasterCategoryPagination;
  isMoreOpen: boolean;
  toggleMore: () => void;
  handleCloseMore: () => void;
  goDelete: () => void;
};

export type MasterCategoryProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: CategoryData[];
  totalCount: number;
  isMoreOpen: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  isMissingData: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (searchTerm: string) => void;
  onCreate: () => void;
  onEdit: (category: CategoryData) => void;
  onBack: () => void;
  onMore: () => void;
  onCloseMore: () => void;
  onDelete: () => void;
};

export type ModalState = {
  isModalOpen: boolean;
  editingCategory: CategoryData | null;
  openCreateModal: () => void;
  openEditModal: (data: CategoryData) => void;
  closeModal: () => void;
};

export type ConfirmModalState = {
  isConfirmModalOpen: boolean;
  deletingCategory: CategoryData | null;
  openConfirmModal: (data: CategoryData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};

export type BaseCategoryState = ModalState & ConfirmModalState;
