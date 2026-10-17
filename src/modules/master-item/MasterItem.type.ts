/**
 * @file MasterItem.type.ts
 * @description Types for Master Item module.
 */

import type { TableColumn } from "../../components/Table";
import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";

export type ApiItem = {
  id: string;
  name: string;
  category_id: string | null;
  category_name?: string | null;
  price: number | null;
  stock: number | null;
  image: string | null;
  duration: number | null;
  remark: string | null;
  status: number;
  created_at: string | null;
  created_by: string | null;
};

export type ItemListResponse = ApiEnvelope<ApiItem[] | null> & PaginatedResponse<ApiItem>;
export type ItemCreateResponse = ApiEnvelope<ApiItem | null>;
export type ItemDetailResponse = ApiEnvelope<ApiItem | null>;

export type ItemListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

export type ItemCreatePayload = {
  name: string;
  category_id: string;
  price: number;
  stock: number;
  image: string;
  duration: number;
  remark: string;
  status: number;
};

export type ItemUpdatePayload = ItemCreatePayload & {
  id: string;
};

export type MasterItemCreateState = {
  createItem: (payload: ItemCreatePayload) => Promise<ItemCreateResponse>;
  isCreating: boolean;
};

/** Item data structure */
export type ItemData = {
  id: string;
  name: string;
  categoryId: string | null;
  categoryName: string | null;
  price: number;
  stock: number;
  image: string | null;
  duration: number;
  remark: string | null;
  status: "active" | "inactive";
  createAt: string | null;
  createBy: string | null;
};

/** Master Item component props */
export type MasterItemProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: ItemData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<ItemData>[];
  onCreate: () => void;
  onEdit: (item: ItemData) => void;
  onRowClick: (item: ItemData) => void;
  onMore?: () => void;
  isMoreOpen: boolean;
  onCloseMore: () => void;
  onDelete: () => void;
  onBack: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  isMissingData: boolean;
  setSearchTerm: (searchTerm: string) => void;
};

/** Toolbar props */
export type ItemToolbarProps = {
  pageSize: number;
  totalCount: number;
  changePageSize: (size: number) => void;
};

/** API list state */
export type ItemListApiState = {
  isLoading: boolean;
  errorMessage: string | null;
  isMissingData: boolean;
  paginatedData: ItemData[];
  totalPages: number;
  totalCount: number;
};

/** Action buttons props */
export type ItemActionProps = {
  row: ItemData;
  onEdit: (item: ItemData) => void;
  onConfirm: (item: ItemData) => void;
};

/** Modal state */
export type ModalState = {
  isModalOpen: boolean;
  editingItem: ItemData | null;
  openCreateModal: () => void;
  openEditModal: (item: ItemData) => void;
  closeModal: () => void;
};

/** Confirm modal state */
export type ConfirmModalState = {
  isConfirmModalOpen: boolean;
  deletingItem: ItemData | null;
  openConfirmModal: (item: ItemData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};

/** Base item state */
export type BaseItemState = ModalState & ConfirmModalState;

/** Mobile item card props */
export type MobileItemCardProps = {
  item: ItemData;
  onEdit: (item: ItemData) => void;
};

/** Required item fields. */
export type RequiredItemFields = {
  name: string;
  categoryId: string;
  price: string;
  stock: string;
  duration: string;
};

/** Action button props */
export type ActionButtonProps = {
  row: ItemData;
  onEdit: (item: ItemData) => void;
};

/** GetColumns params */
export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (item: ItemData) => void;
};

/** Navigation hook return type */
export type MasterItemNavigation = {
  goBack: () => void;
  goCreate: () => void;
  goEdit: (item: ItemData) => void;
  goDetail: (item: ItemData) => void;
};

/** Master item pagination state */
export type MasterItemPagination = ItemListApiState & {
  currentPage: number;
  pageSize: number;
  isEmpty: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (searchTerm: string) => void;
};

/** Container state hook return type */
export type MasterItemContainerState = MasterItemNavigation & {
  pagination: MasterItemPagination;
  isMoreOpen: boolean;
  toggleMore: () => void;
  goDelete: () => void;
  handleCloseMore: () => void;
  handleConfirm: () => void;
};
