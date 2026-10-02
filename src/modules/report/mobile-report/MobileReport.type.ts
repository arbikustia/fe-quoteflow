import type { QuoteData } from "@/modules/order/desktop-order/DesktopOrder.type";

export type MobileReportProps = {
  readonly orders: QuoteData[];
  readonly onNavigate: (path: string) => void;
};

export type MobileHeaderProps = {
  readonly onNavigate: (path: string) => void;
};

export type OrderRowProps = {
  readonly order: QuoteData;
  readonly index: number;
  readonly onNavigate: (path: string) => void;
};
