import * as React from "react";
import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type PicData = MasterBase & {
  name: string;
};

export type MasterPicProps = {
  isModalOpen: boolean;
  isConfirmModalOpen: boolean;
  editingPic: PicData | null;
  deletingPic: PicData | null;
  openCreateModal: () => void;
  openEditModal: (pic: PicData) => void;
  closeModal: () => void;
  openConfirmModal: (pic: PicData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: PicData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<PicData>[];
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type PicFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingPic: PicData | null;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type PicToolbarProps = {
  pageSize: number;
  totalCount: number;
  changePageSize: (size: number) => void;
};

export type PicActionProps = {
  row: PicData;
  onEdit: (pic: PicData) => void;
  onConfirm: (pic: PicData) => void;
};

export type ModalState = {
  isModalOpen: boolean;
  editingPic: PicData | null;
  openCreateModal: () => void;
  openEditModal: (pic: PicData) => void;
  closeModal: () => void;
};

export type ConfirmModalState = {
  isConfirmModalOpen: boolean;
  deletingPic: PicData | null;
  openConfirmModal: (pic: PicData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};

export type BasePicState = Omit<
  MasterPicProps,
  | "changePageSize"
  | "columns"
  | "currentPage"
  | "goToPage"
  | "nextPage"
  | "onSubmit"
  | "pageSize"
  | "paginatedData"
  | "prevPage"
  | "totalCount"
  | "totalPages"
>;

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (pic: PicData) => void;
  onConfirm: (pic: PicData) => void;
};
