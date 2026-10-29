import type { ApiRentalTransactionDetail } from "../Order.type";
import type { ProjectData } from "@/modules/master-project/MasterProject.type";

export type OrderDetailProps = {
  order: ApiRentalTransactionDetail | null;
  projects: ProjectData[];
  isLoading: boolean;
  errorMessage: string | null;
  onNavigateBack: () => void;
  onEdit: () => void;
};
