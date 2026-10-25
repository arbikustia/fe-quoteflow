import type { QuoteData } from "@/modules/order/Order.type";

export type MobileReportProps = {
  orders: QuoteData[];
  onNavigate: (path: string) => void;
};

export type MobileHeaderProps = {
  onNavigate: (path: string) => void;
};

export type OrderRowProps = {
  order: QuoteData;
  index: number;
  onNavigate: (path: string) => void;
};
