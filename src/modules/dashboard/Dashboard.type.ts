import { z } from "zod";

import type { CalendarEventItem } from "@/components/Calendar";

export type DashboardMenuRoute = "/order/create" | "/document" | "/item-checklist" | "/item-return" | "/master-main" | "/mail" | "/report" | "/activity-log";

export type DashboardRoute = DashboardMenuRoute | "/master-voucher" | "/calendar";

export type DashboardMetricKey = "quotation" | "invoice" | "payment" | "voucher";

export type DashboardMenuItem = {
  route: DashboardMenuRoute;
  label: string;
  icon: string;
  backgroundClassName: string;
};

export type DashboardMetricConfig = {
  key: DashboardMetricKey;
  label: string;
  description: string;
  colorClassName: string;
  surfaceClassName: string;
};

export type DashboardQueryParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

export type DashboardAccess = Record<DashboardMenuRoute, boolean>;

export type DashboardChartDatum = {
  label: string;
  count: number;
};

export type DashboardChartSummary = {
  maxCount: number;
  totalOrders: number;
};

export type DashboardCounts = Record<DashboardMetricKey, number>;

export const CountableResponseSchema = z.object({
  total_count: z.number().default(0),
});

export type CountableResponse = z.infer<typeof CountableResponseSchema>;

export type CountableResponseInput = z.input<typeof CountableResponseSchema>;

export type DashboardNavigation = {
  navigateTo: (route: DashboardRoute) => void;
};

export type DashboardOverviewState = {
  isLoading: boolean;
  counts: DashboardCounts;
};

export type DashboardOrderState = {
  isLoading: boolean;
  isError: boolean;
  chartData: DashboardChartDatum[];
};

export type DashboardCalendarState = {
  isLoading: boolean;
  events: CalendarEventItem[];
};

export type DashboardProps = {
  isLoading: boolean;
  voucherCount: number | null;
  menuItems: DashboardMenuItem[];
  overview: DashboardOverviewState;
  calendar: DashboardCalendarState;
  orderState: DashboardOrderState;
  onNavigate: (route: DashboardRoute) => void;
};
