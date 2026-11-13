import { DASHBOARD_ACTIVE_VOUCHER_STATUS, DASHBOARD_CHART_DAYS } from "./Dashboard.config";
import type { CountableResponse, CountableResponseInput, DashboardAccess, DashboardChartDatum, DashboardChartSummary, DashboardMenuItem } from "./Dashboard.type";
import { CountableResponseSchema } from "./Dashboard.type";

import type { ApiVoucher } from "@/modules/master-data/master-voucher/MasterVoucher.type";
import type { ApiRentalOrder } from "@/modules/report/Report.type";

/**
 * Normalize a paged response into its total count, defaulting to 0 while loading.
 * @param {CountableResponseInput} [rawData] - Raw paged response, undefined while the query is loading
 * @returns {number} - Total record count
 */
export const getTotalCount = (rawData?: CountableResponseInput): number => {
  const parsed: CountableResponse = CountableResponseSchema.parse(rawData ?? {});

  return parsed.total_count;
};

/**
 * Check whether two dates fall on the same calendar day.
 * @param {Date} first - First date
 * @param {Date} second - Second date
 * @returns {boolean} - True when year, month and day match
 */
export const isSameDay = (first: Date, second: Date): boolean => first.getFullYear() === second.getFullYear()
  && first.getMonth() === second.getMonth()
  && first.getDate() === second.getDate();

/**
 * Count rental orders created per day for the last seven days.
 * @param {ApiRentalOrder[]} orders - Rental orders
 * @param {Date} today - Reference date (last bucket)
 * @returns {DashboardChartDatum[]} - One datum per day, oldest first
 */
export const buildOrderChartData = (orders: ApiRentalOrder[], today: Date): DashboardChartDatum[] => Array.from({ length: DASHBOARD_CHART_DAYS }, (_, index): DashboardChartDatum => {
  const date = new Date(today);

  date.setHours(0, 0, 0, 0);
  date.setDate(today.getDate() - (DASHBOARD_CHART_DAYS - 1 - index));

  return {
    label: date.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
    count: orders.filter((order) => isSameDay(new Date(order.created_at), date)).length,
  };
});

/**
 * Summarize chart data for bar scaling and the headline total.
 * @param {DashboardChartDatum[]} chartData - Chart data
 * @returns {DashboardChartSummary} - Highest daily count (min 1) and total orders
 */
export const summarizeChart = (chartData: DashboardChartDatum[]): DashboardChartSummary => ({
  maxCount: Math.max(...chartData.map((datum) => datum.count), 1),
  totalOrders: chartData.reduce((sum, datum) => sum + datum.count, 0),
});

/**
 * Count vouchers that are active.
 * @param {ApiVoucher[]} vouchers - Vouchers
 * @returns {number} - Active voucher count
 */
export const countActiveVouchers = (vouchers: ApiVoucher[]): number => vouchers.filter((voucher) => voucher.status === DASHBOARD_ACTIVE_VOUCHER_STATUS).length;

/**
 * Keep menu items the user may open.
 * @param {DashboardMenuItem[]} items - All menu items
 * @param {DashboardAccess} access - View permission per route
 * @returns {DashboardMenuItem[]} - Visible menu items
 */
export const filterMenuItems = (items: DashboardMenuItem[], access: DashboardAccess): DashboardMenuItem[] => items.filter((item) => access[item.route]);
