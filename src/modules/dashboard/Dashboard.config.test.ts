import { DASHBOARD_MENU_ITEMS, DASHBOARD_METRICS } from "./Dashboard.config";

describe("Dashboard.config", (): void => {
  it("should include Mail navigation in the mobile menu", (): void => {
    expect(DASHBOARD_MENU_ITEMS).toEqual(
      expect.arrayContaining([expect.objectContaining({ label: "Mail", route: "/mail" })]),
    );
  });

  it("should define one metric per key", (): void => {
    expect(DASHBOARD_METRICS.map((metric) => metric.key)).toEqual(["quotation", "invoice", "payment", "voucher"]);
  });
});
