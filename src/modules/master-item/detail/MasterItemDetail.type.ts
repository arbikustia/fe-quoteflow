import type { ItemData } from "../MasterItem.type";

export type MasterItemDetailState = {
  readonly item: ItemData | null;
  readonly isMoreOpen: boolean;
  readonly isDeleteModalOpen: boolean;
  readonly goBack: () => void;
  readonly toggleMore: () => void;
  readonly closeMore: () => void;
  readonly goEdit: () => void;
  readonly openDeleteModal: () => void;
  readonly closeDeleteModal: () => void;
  readonly handleDelete: () => void;
};
