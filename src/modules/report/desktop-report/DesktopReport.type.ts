import type { QuoteData } from "@/modules/order/desktop-order/DesktopOrder.type";

export type DesktopReportProps = {
  completedOrders: QuoteData[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: QuoteData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
};
