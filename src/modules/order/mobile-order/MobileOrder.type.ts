import type { QuoteData } from "../desktop-order/DesktopOrder.type";

/**
 * MobileOrder Props type
 */
export type MobileOrderProps = {
  quotes: QuoteData[];
  onNavigate: (path: string) => void;
};
