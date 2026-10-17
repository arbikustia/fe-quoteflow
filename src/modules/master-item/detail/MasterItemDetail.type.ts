import type { ItemData } from "../MasterItem.type";

export type MasterItemDetailMenuState = {
  isMoreOpen: boolean;
  isDeleteModalOpen: boolean;
  toggleMore: () => void;
  closeMore: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
};

export type MasterItemDetailState = MasterItemDetailMenuState & {
  item: ItemData | null;
  goBack: () => void;
  goEdit: () => void;
  handleDelete: () => void;
};
