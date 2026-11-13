import type { ApiVoucher } from "@/modules/master-data/master-voucher/MasterVoucher.type";
import type { ApiRentalOrder } from "@/modules/report/Report.type";

import { DASHBOARD_MENU_ITEMS } from "./Dashboard.config";
import type { DashboardAccess } from "./Dashboard.type";
import { buildOrderChartData, countActiveVouchers, filterMenuItems, getTotalCount, isSameDay, summarizeChart } from "./Dashboard.util";

const TODAY = new Date(2026, 10, 13, 15, 30);

/**
 * Build a rental order created at the given date.
 * @param {Date} createdAt - Creation date
 * @returns {ApiRentalOrder} - Partial order cast for chart tests
 */
const buildOrder = (createdAt: Date): ApiRentalOrder => ({ created_at: createdAt.toISOString() }) as ApiRentalOrder;

describe("Dashboard.util", (): void => {
  it("should default total count to 0 when data is undefined", (): void => {
    expect(getTotalCount(undefined)).toBe(0);
  });

  it("should read total_count from a paged response", (): void => {
    expect(getTotalCount({ total_count: 42 })).toBe(42);
  });

  it("should match dates on the same calendar day only", (): void => {
    expect(isSameDay(new Date(2026, 10, 13, 1), new Date(2026, 10, 13, 23))).toBe(true);
    expect(isSameDay(new Date(2026, 10, 13), new Date(2026, 10, 14))).toBe(false);
  });

  it("should build seven buckets, oldest first, counting orders per day", (): void => {
    const orders = [buildOrder(new Date(2026, 10, 13, 9)), buildOrder(new Date(2026, 10, 13, 18)), buildOrder(new Date(2026, 10, 7, 9)), buildOrder(new Date(2026, 9, 1))];
    const result = buildOrderChartData(orders, TODAY);

    expect(result).toHaveLength(7);
    expect(result[6].count).toBe(2);
    expect(result[0].count).toBe(1);
    expect(result.reduce((sum, datum) => sum + datum.count, 0)).toBe(3);
  });

  it("should ignore orders with an invalid created_at", (): void => {
    const result = buildOrderChartData([{ created_at: "nope" } as ApiRentalOrder], TODAY);

    expect(result.every((datum) => datum.count === 0)).toBe(true);
  });

  it("should summarize chart with a minimum max of 1", (): void => {
    expect(summarizeChart([{ label: "a", count: 0 }])).toEqual({ maxCount: 1, totalOrders: 0 });
    expect(summarizeChart([{ label: "a", count: 3 }, { label: "b", count: 5 }])).toEqual({ maxCount: 5, totalOrders: 8 });
  });

  it("should count only active vouchers", (): void => {
    const vouchers = [{ status: 1 }, { status: 0 }, { status: 1 }] as ApiVoucher[];

    expect(countActiveVouchers(vouchers)).toBe(2);
  });

  it("should keep only menu items the user can open", (): void => {
    const access: DashboardAccess = {
      "/order/create": true,
      "/document": false,
      "/item-checklist": true,
      "/item-return": true,
      "/master-main": true,
      "/mail": true,
      "/report": true,
      "/activity-log": true,
    };
    const labels = filterMenuItems(DASHBOARD_MENU_ITEMS, access).map((item) => item.label);

    expect(labels).not.toContain("Document");
    expect(labels).toContain("Create Order");
  });
});
