import type { ApiRentalTransactionDetail } from "../Order.type";

export type OrderDetailProps = {
  order: ApiRentalTransactionDetail | null;
  isLoading: boolean;
  errorMessage: string | null;
  onNavigateBack: () => void;
};
