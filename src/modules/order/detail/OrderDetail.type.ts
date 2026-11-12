import type { ApiRentalTransactionDetail } from "../Order.type";

import type { ApiProject } from "@/modules/master-data/master-project/MasterProject.type";

export type OrderDetailRouteState = {
  from?: string;
  returnUrl?: string;
};

export type OrderDetailProps = {
  order: ApiRentalTransactionDetail | null;
  projects: ApiProject[];
  isLoading: boolean;
  errorMessage: string | null;
  onNavigateBack: () => void;
  onEdit?: () => void;
  breadcrumbs?: string[];
};
