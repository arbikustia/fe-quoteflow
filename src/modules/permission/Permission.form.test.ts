import { buildPermissionPayload, getPermissionPages } from "./Permission.form";

describe("permission form", () => {
  it("builds available pages from sidebar routing", () => {
    const pages = getPermissionPages();

    expect(pages).toEqual(expect.arrayContaining([
      expect.objectContaining({ menu: "Document", page: "Quotation", url: "/document/quotation" }),
      expect.objectContaining({ menu: "Master Data", page: "Customer", url: "/master-customer" }),
    ]));
    expect(pages.some((page) => page.url === "/permission")).toBe(false);
    expect(pages.find((page) => page.url === "/home")?.actions).toEqual(["view"]);
    expect(pages.find((page) => page.url === "/calendar")?.actions).toEqual(["view"]);
    expect(pages.find((page) => page.url === "/mail")?.actions).toEqual(["view", "create"]);
    expect(pages.find((page) => page.url === "/report")?.actions).toEqual(["view"]);
    expect(pages.find((page) => page.url === "/activity-log")?.actions).toEqual(["view"]);
    expect(pages.find((page) => page.url === "/master-customer")?.actions).toEqual(["view", "create", "edit"]);
  });

  it("builds POST payload with menu order and selected permissions", () => {
    const payload = buildPermissionPayload("arbi", [
      { menu: "Document", number: 2, page: "Quotation", url: "/document/quotation", actions: ["view", "create", "edit"], permission: ["view", "create"] },
      { menu: "Document", number: 2, page: "Invoice", url: "/document/invoice", actions: ["view", "create", "edit"], permission: [] },
      { menu: "Master Data", number: 10, page: "Customer", url: "/master-customer", actions: ["view", "create", "edit"], permission: ["view", "edit"] },
    ]);

    expect(payload).toEqual({
      username: "arbi",
      menus: [
        { menu: "Document", number: 2, pages: [{ page: "Quotation", url: "/document/quotation", permission: ["view", "create"] }] },
        { menu: "Master Data", number: 10, pages: [{ page: "Customer", url: "/master-customer", permission: ["view", "edit"] }] },
      ],
    });
  });
});
