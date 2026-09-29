/**
 * Recent Quote Type
 */
export type RecentQuote = {
  client: string;
  amount: string;
  status: string;
  date: string;
  color: string;
  bg: string;
};

/**
 * Desktop Dashboard Props
 */
export type DesktopDashboardProps = {
  readonly quotes: RecentQuote[];
  readonly onNewOrder: () => void;
  readonly onReturn: () => void;
};
