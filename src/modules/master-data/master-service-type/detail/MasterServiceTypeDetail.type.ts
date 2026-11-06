import type { ServiceTypeData } from "../MasterServiceType.type";

export type MasterServiceTypeDetailMenuState = {
  isMoreOpen: boolean;
  isDeleteModalOpen: boolean;
  toggleMore: () => void;
  closeMore: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
};

export type MasterServiceTypeDetailState = MasterServiceTypeDetailMenuState & {
  serviceType: ServiceTypeData | null;
  goBack: () => void;
  goEdit: () => void;
  handleDelete: () => void;
};
