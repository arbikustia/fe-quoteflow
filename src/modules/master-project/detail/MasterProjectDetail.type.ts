import type { ProjectData } from "../MasterProject.type";

export type MasterProjectDetailMenuState = {
  readonly isMoreOpen: boolean;
  readonly isDeleteModalOpen: boolean;
  readonly toggleMore: () => void;
  readonly closeMore: () => void;
  readonly openDeleteModal: () => void;
  readonly closeDeleteModal: () => void;
};

export type MasterProjectDetailState = MasterProjectDetailMenuState & {
  readonly project: ProjectData | null;
  readonly goBack: () => void;
  readonly goEdit: () => void;
  readonly handleDelete: () => void;
};
