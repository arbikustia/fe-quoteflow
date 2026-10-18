import type { UserData } from "../MasterUser.type";

export type MasterUserDetailMenuState = {
  isMoreOpen: boolean;
  isDeleteModalOpen: boolean;
  toggleMore: () => void;
  closeMore: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
};

export type MasterUserDetailState = MasterUserDetailMenuState & {
  user: UserData | null;
  goBack: () => void;
  goEdit: () => void;
  handleDelete: () => void;
};
