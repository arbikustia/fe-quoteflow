import type { PicData } from "../MasterPic.type";

export type MasterPicDetailMenuState = {
  readonly isMoreOpen: boolean;
  readonly isDeleteModalOpen: boolean;
  readonly toggleMore: () => void;
  readonly closeMore: () => void;
  readonly openDeleteModal: () => void;
  readonly closeDeleteModal: () => void;
};

export type MasterPicDetailState = MasterPicDetailMenuState & {
  readonly pic: PicData | null;
  readonly goBack: () => void;
  readonly goEdit: () => void;
  readonly handleDelete: () => void;
};
