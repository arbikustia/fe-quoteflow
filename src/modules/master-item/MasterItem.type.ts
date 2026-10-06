/**
 * @file MasterItem.type.ts
 * @description Types for Master Item module.
 */

import type { TableColumn } from "../../components/Table";
import type { MasterBase } from "../../types/master";

/** Item data structure */
export type ItemData = MasterBase & {
  readonly name: string;
  readonly category: string;
  readonly price: number;
  readonly stock: number;
  readonly image: string;
  readonly duration: string;
  readonly remark: string;
  readonly unit: string;
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
  readonly isMoreOpen?: boolean;
  readonly onCloseMore?: () => void;
  readonly onDelete?: () => void;
  readonly onBack: () => void;
};

/** Toolbar props */
export type ItemToolbarProps = {
  readonly pageSize: number;
  readonly totalCount: number;
  readonly changePageSize: (size: number) => void;
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
  readonly onConfirm: (item: ItemData) => void;
};

/** Navigation hook return type */
export type MasterItemNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (item: ItemData) => void;
  readonly goDetail: (item: ItemData) => void;
};

/** Container state hook return type */
export type MasterItemContainerState = MasterItemNavigation & {
  readonly pagination: {
    readonly currentPage: number;
    readonly totalPages: number;
    readonly pageSize: number;
    readonly paginatedData: readonly ItemData[];
    readonly goToPage: (page: number) => void;
    readonly nextPage: () => void;
    readonly prevPage: () => void;
    readonly changePageSize: (size: number) => void;
    readonly totalCount: number;
  };
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly goDelete: () => void;
  readonly handleCloseMore: () => void;
  readonly handleConfirm: () => void;
};
