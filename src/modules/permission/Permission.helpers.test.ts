import { checkPermission, flattenPermissionMenus } from "./Permission.helpers";

describe("flattenPermissionMenus", () => {
  it("should preserve backend menu and page order", () => {
    const rows = flattenPermissionMenus([
      {
        menu: "Document",
        pages: [
          { page: "Quotation", url: "/quotation", permission: ["view", "create"] },
          { page: "Invoice", url: "/invoice", permission: ["view"] },
        ],
      },
      {
        menu: "Report",
        pages: [{ page: "Order", url: "/report", permission: ["view"] }],
      },
    ]);

    expect(rows.map((row) => row.page)).toEqual(["Quotation", "Invoice", "Order"]);
    expect(rows[1]).toEqual({
      id: "Document-/invoice-Invoice",
      menu: "Document",
      page: "Invoice",
      url: "/invoice",
      permission: ["view"],
    });
  });

  it("should check actions by exact page URL", () => {
    const rows = flattenPermissionMenus([{ menu: "Master Data", pages: [{ page: "Customer", url: "/master-customer", permission: ["view", "create"] }] }]);

    expect(checkPermission(rows, "/master-customer", "view")).toBe(true);
    expect(checkPermission(rows, "/master-customer", "edit")).toBe(false);
    expect(checkPermission(rows, "/master-category", "view")).toBe(false);
  });
});
