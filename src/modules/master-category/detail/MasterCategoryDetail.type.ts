import type { CategoryData } from "../MasterCategory.type";

export type MasterCategoryDetailMenuState = {
  readonly isMoreOpen: boolean;
  readonly isDeleteModalOpen: boolean;
  readonly toggleMore: () => void;
  readonly closeMore: () => void;
  readonly openDeleteModal: () => void;
  readonly closeDeleteModal: () => void;
};

export type MasterCategoryDetailState = {
  readonly category: CategoryData | null;
  readonly isMoreOpen: boolean;
  readonly isDeleteModalOpen: boolean;
  readonly goBack: () => void;
  readonly toggleMore: () => void;
  readonly closeMore: () => void;
  readonly openDeleteModal: () => void;
  readonly closeDeleteModal: () => void;
  readonly goEdit: () => void;
  readonly handleDelete: () => void;
};
