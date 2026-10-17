/**
 * @file MasterItem.type.ts
 * @description Types for Master Item module.
 */

import type { TableColumn } from "../../components/Table";
import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";
import type { MasterBase } from "../../types/master";

export type ApiItem = {
  readonly id: string;
  readonly name: string;
  readonly category_id: string | null;
  readonly category_name?: string | null;
  readonly price: number | null;
  readonly stock: number | null;
  readonly image: string | null;
  readonly duration: number | null;
  readonly remark: string | null;
  readonly status: number;
  readonly created_at: string | null;
  readonly created_by: string | null;
};

export type ItemListResponse = PaginatedResponse<ApiItem>;
export type ItemCreateResponse = ApiEnvelope<ApiItem | null>;

export type ItemListParams = {
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly searchTerm: string;
};

export type ItemCreatePayload = {
  readonly name: string;
  readonly category_id: string;
  readonly price: number;
  readonly stock: number;
  readonly image: string;
  readonly duration: number;
  readonly remark: string;
  readonly status: number;
};

export type ItemUpdatePayload = ItemCreatePayload & {
  readonly id: string;
};

export type MasterItemCreateState = {
  readonly createItem: (payload: ItemCreatePayload) => Promise<ItemCreateResponse>;
  readonly isCreating: boolean;
};

/** Item data structure */
export type ItemData = MasterBase & {
  readonly name: string;
  readonly categoryId: string;
  readonly categoryName: string;
  readonly price: number;
  readonly stock: number;
  readonly image: string;
  readonly duration: number;
  readonly remark: string;
};

/** Master Item component props */
export type MasterItemProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: readonly ItemData[];
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly totalCount: number;
  readonly columns: readonly TableColumn<ItemData>[];
  readonly onCreate: () => void;
  readonly onEdit: (item: ItemData) => void;
  readonly onRowClick: (item: ItemData) => void;
  readonly onMore?: () => void;
  readonly isMoreOpen: boolean;
  readonly onCloseMore: () => void;
  readonly onDelete: () => void;
  readonly onBack: () => void;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isEmpty: boolean;
  readonly isMissingData: boolean;
  readonly setSearchTerm: (searchTerm: string) => void;
};

/** Toolbar props */
export type ItemToolbarProps = {
  readonly pageSize: number;
  readonly totalCount: number;
  readonly changePageSize: (size: number) => void;
};

/** API list state */
export type ItemListApiState = {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isMissingData: boolean;
  readonly paginatedData: readonly ItemData[];
  readonly totalPages: number;
  readonly totalCount: number;
};

/** Action buttons props */
export type ItemActionProps = {
  readonly row: ItemData;
  readonly onEdit: (item: ItemData) => void;
  readonly onConfirm: (item: ItemData) => void;
};

/** Modal state */
export type ModalState = {
  readonly isModalOpen: boolean;
  readonly editingItem: ItemData | null;
  readonly openCreateModal: () => void;
  readonly openEditModal: (item: ItemData) => void;
  readonly closeModal: () => void;
};

/** Confirm modal state */
export type ConfirmModalState = {
  readonly isConfirmModalOpen: boolean;
  readonly deletingItem: ItemData | null;
  readonly openConfirmModal: (item: ItemData) => void;
  readonly closeConfirmModal: () => void;
  readonly onConfirmDelete: () => void;
};

/** Base item state */
export type BaseItemState = ModalState & ConfirmModalState;

/** GetColumns params */
export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (item: ItemData) => void;
};

/** Navigation hook return type */
export type MasterItemNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (item: ItemData) => void;
  readonly goDetail: (item: ItemData) => void;
};

/** Master item pagination state */
export type MasterItemPagination = ItemListApiState & {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly isEmpty: boolean;
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly setSearchTerm: (searchTerm: string) => void;
};

/** Container state hook return type */
export type MasterItemContainerState = MasterItemNavigation & {
  readonly pagination: MasterItemPagination;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly goDelete: () => void;
  readonly handleCloseMore: () => void;
  readonly handleConfirm: () => void;
};
