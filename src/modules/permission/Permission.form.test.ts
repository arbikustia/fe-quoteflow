import { buildPermissionPayload, getPermissionPages } from "./Permission.form";

describe("permission form", () => {
  it("builds available pages from sidebar routing", () => {
    const pages = getPermissionPages();

    expect(pages).toEqual(expect.arrayContaining([
      expect.objectContaining({ menu: "Document", page: "Quotation", url: "/document/quotation" }),
      expect.objectContaining({ menu: "Master Data", page: "Customer", url: "/master-customer" }),
    ]));
    expect(pages.some((page) => page.url === "/permission")).toBe(false);
  });

  it("builds POST payload with menu order and selected permissions", () => {
    const payload = buildPermissionPayload("arbi", [
      { menu: "Document", number: 2, page: "Quotation", url: "/document/quotation", permission: ["view", "create"] },
      { menu: "Document", number: 2, page: "Invoice", url: "/document/invoice", permission: [] },
      { menu: "Master Data", number: 10, page: "Customer", url: "/master-customer", permission: ["view", "edit"] },
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
