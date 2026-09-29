import type { QuoteData } from "../../order/desktop-order/DesktopOrder.type";

export type MobileReturnProps = {
  quotes: QuoteData[];
  onNavigateDetail: (id: string) => void;
};
