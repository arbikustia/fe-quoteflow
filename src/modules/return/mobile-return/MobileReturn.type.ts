import type { QuoteData } from "../../order/Order.type";

export type MobileReturnProps = {
  quotes: QuoteData[];
  onNavigateDetail: (id: string) => void;
};
