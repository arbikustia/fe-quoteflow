import type { QuoteData } from "../order-page/OrderPage.type";

export type ReportProps = {
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
