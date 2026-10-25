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
  quotes: RecentQuote[];
  onNewOrder: () => void;
  onReturn: () => void;
};

/**
 * Hook Return Type
 */
export type DesktopDashboardHookReturn = {
  handleNewOrder: () => void;
  handleReturn: () => void;
};
