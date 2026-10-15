import type { UserData } from "../MasterUser.type";

export type MasterUserDetailMenuState = {
  readonly isMoreOpen: boolean;
  readonly isDeleteModalOpen: boolean;
  readonly toggleMore: () => void;
  readonly closeMore: () => void;
  readonly openDeleteModal: () => void;
  readonly closeDeleteModal: () => void;
};

export type MasterUserDetailState = MasterUserDetailMenuState & {
  readonly user: UserData | null;
  readonly goBack: () => void;
  readonly goEdit: () => void;
  readonly handleDelete: () => void;
};
