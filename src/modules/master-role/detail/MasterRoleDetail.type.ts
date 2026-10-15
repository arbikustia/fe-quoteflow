import type { RoleData } from "../MasterRole.type";

export type MasterRoleDetailMenuState = {
  readonly isMoreOpen: boolean;
  readonly isDeleteModalOpen: boolean;
  readonly toggleMore: () => void;
  readonly closeMore: () => void;
  readonly openDeleteModal: () => void;
  readonly closeDeleteModal: () => void;
};

export type MasterRoleDetailState = MasterRoleDetailMenuState & {
  readonly role: RoleData | null;
  readonly goBack: () => void;
  readonly goEdit: () => void;
  readonly handleDelete: () => void;
};
