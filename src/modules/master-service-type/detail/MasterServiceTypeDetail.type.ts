import type { ServiceTypeData } from "../MasterServiceType.type";

export type MasterServiceTypeDetailMenuState = {
  readonly isMoreOpen: boolean;
  readonly isDeleteModalOpen: boolean;
  readonly toggleMore: () => void;
  readonly closeMore: () => void;
  readonly openDeleteModal: () => void;
  readonly closeDeleteModal: () => void;
};

export type MasterServiceTypeDetailState = MasterServiceTypeDetailMenuState & {
  readonly serviceType: ServiceTypeData | null;
  readonly goBack: () => void;
  readonly goEdit: () => void;
  readonly handleDelete: () => void;
};
