import type { ApiRentalTransactionDetail } from "../Order.type";

export type OrderDetailProps = {
  readonly order: ApiRentalTransactionDetail | null;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly onNavigateBack: () => void;
};
