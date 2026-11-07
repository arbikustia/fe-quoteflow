import { DASHBOARD_MENU_ITEMS } from "./Dashboard.config";

describe("dashboard mobile menu", () => {
  it("includes Mail navigation", () => {
    expect(DASHBOARD_MENU_ITEMS).toEqual(
      expect.arrayContaining([expect.objectContaining({ label: "Mail", route: "/mail" })]),
    );
  });
});
