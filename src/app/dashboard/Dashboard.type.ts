import type { CalendarEventItem } from "@/components/Calendar";

export type DashboardRoute = "/order" | "/order/create" | "/return" | "/document" | "/document/quotation" | "/document/item-checklist" | "/master-main" | "/master-voucher" | "/report" | "/calendar";

export type DashboardOrder = {
  id: string;
  eventName: string;
  customerName: string;
  startDate: string;
  endDate: string;
  grandTotal: number;
  status: number;
  createdAt: string;
};

export type DashboardOrderState = {
  isLoading: boolean;
  orders: DashboardOrder[];
  chartData: DashboardQuotationChartDatum[];
};

export type DashboardMenuItem = {
  route?: DashboardRoute;
  label: string;
  icon: string;
  backgroundClassName: string;
};

export type DashboardAssets = {
  isLoading: boolean;
  voucherCount: number | null;
};

export type DashboardOverview = {
  isLoading: boolean;
  quotationCount: number;
  invoiceCount: number;
  paymentCount: number;
  voucherCount: number;
  quotationValue: number;
  invoiceValue: number;
  paymentValue: number;
};

export type DashboardMetric = {
  label: string;
  count: number;
  value: number;
  colorClassName: string;
};

export type DashboardRentalOrderRange = {
  dateFrom: string;
  dateTo: string;
  label: string;
};

export type DashboardTrendDatum = {
  label: string;
  totalOrders: number;
  totalAmount: number;
};

export type DashboardOverviewState = DashboardOverview & {
  isChartLoading: boolean;
  isChartError: boolean;
  chartDateFrom: string;
  chartDateTo: string;
  trend: DashboardTrendDatum[];
};

export type DashboardVoucherState = {
  isLoading: boolean;
  count: number | null;
};

export type DashboardQuotation = {
  id: string;
  quotationNumber: string;
  customerName: string;
  eventName: string;
  startDate: string;
  endDate: string;
  grandTotal: number;
  status: number;
  createdAt: string;
};

export type DashboardQuotationChartDatum = {
  label: string;
  count: number;
};

export type DashboardQuotationState = {
  isLoading: boolean;
  quotations: DashboardQuotation[];
  chartData: DashboardQuotationChartDatum[];
  calendarEvents: CalendarEventItem[];
};

export type DashboardNavigation = {
  navigateTo: (route: DashboardRoute) => void;
  navigateToQuotation: (id: string) => void;
  navigateToOrder: (id: string) => void;
};
