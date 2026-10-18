import type { PicData } from "../MasterPic.type";

export type MasterPicDetailMenuState = {
  isMoreOpen: boolean;
  isDeleteModalOpen: boolean;
  toggleMore: () => void;
  closeMore: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
};

export type MasterPicDetailState = MasterPicDetailMenuState & {
  pic: PicData | null;
  goBack: () => void;
  goEdit: () => void;
  handleDelete: () => void;
};
