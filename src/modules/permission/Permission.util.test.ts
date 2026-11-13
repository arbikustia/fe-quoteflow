import type { PermissionFormPage } from "./Permission.type";
import {
  buildPermissionPayload,
  buildUserOptions,
  checkPermission,
  countPermissions,
  filterPermissionRows,
  flattenPermissionMenus,
  getPermissionBadgeClass,
  getPermissionErrorMessage,
  getPermissionPages,
  mergePermissions,
  setAllPermissions,
  setRowPermissions,
  togglePermission,
} from "./Permission.util";

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

const PAGES: PermissionFormPage[] = [
  { menu: "Document", number: 2, page: "Quotation", url: "/document/quotation", actions: ["view", "create", "edit"], permission: ["view"] },
  { menu: "Document", number: 2, page: "Invoice", url: "/document/invoice", actions: ["view", "create", "edit"], permission: [] },
];

describe("getPermissionPages", () => {
  it("should build available pages from sidebar routing", () => {
    const pages = getPermissionPages();

    expect(pages).toEqual(expect.arrayContaining([
      expect.objectContaining({ menu: "Document", page: "Quotation", url: "/document/quotation" }),
      expect.objectContaining({ menu: "Master Data", page: "Customer", url: "/master-customer" }),
    ]));
    expect(pages.some((page) => page.url === "/permission")).toBe(false);
  });

  it("should restrict actions on read-only pages", () => {
    const pages = getPermissionPages();

    expect(pages.find((page) => page.url === "/home")?.actions).toEqual(["view"]);
    expect(pages.find((page) => page.url === "/mail")?.actions).toEqual(["view", "create"]);
    expect(pages.find((page) => page.url === "/master-customer")?.actions).toEqual(["view", "create", "edit"]);
  });
});

describe("buildPermissionPayload", () => {
  it("should group selected pages by menu and skip pages without permissions", () => {
    const payload = buildPermissionPayload("arbi", [
      { ...PAGES[0], permission: ["view", "create"] },
      PAGES[1],
      { menu: "Master Data", number: 10, page: "Customer", url: "/master-customer", actions: ["view", "create", "edit"], permission: ["view", "edit"] },
      { ...PAGES[1], permission: ["view"] },
    ]);

    expect(payload.menus).toEqual([
      { menu: "Document", number: 2, pages: [
        { page: "Quotation", url: "/document/quotation", permission: ["view", "create"] },
        { page: "Invoice", url: "/document/invoice", permission: ["view"] },
      ] },
      { menu: "Master Data", number: 10, pages: [{ page: "Customer", url: "/master-customer", permission: ["view", "edit"] }] },
    ]);
    expect(payload.username).toBe("arbi");
  });
});

describe("permission matrix helpers", () => {
  it("should filter rows by menu, page, url or permission", () => {
    const rows = flattenPermissionMenus([{ menu: "Document", pages: [{ page: "Quotation", url: "/q", permission: ["view"] }] }]);

    expect(filterPermissionRows(rows, "  ")).toBe(rows);
    expect(filterPermissionRows(rows, "QUOT")).toHaveLength(1);
    expect(filterPermissionRows(rows, "edit")).toHaveLength(0);
  });

  it("should merge granted permissions limited to the page actions", () => {
    const merged = mergePermissions(
      [{ ...PAGES[0], actions: ["view"], permission: [] }],
      [{ id: "x", menu: "Document", page: "Quotation", url: "/document/quotation", permission: ["view", "edit"] }],
    );

    expect(merged[0].permission).toEqual(["view"]);
  });

  it("should toggle one action without duplicating it", () => {
    const granted = togglePermission(PAGES, "/document/quotation", "view", true);
    const revoked = togglePermission(PAGES, "/document/quotation", "view", false);

    expect(granted[0].permission).toEqual(["view"]);
    expect(revoked[0].permission).toEqual([]);
    expect(togglePermission(PAGES, "/document/invoice", "edit", true)[1].permission).toEqual(["edit"]);
  });

  it("should set row and all permissions and count them", () => {
    expect(setRowPermissions(PAGES, "/document/invoice", true)[1].permission).toEqual(["view", "create", "edit"]);
    expect(setRowPermissions(PAGES, "/document/quotation", false)[0].permission).toEqual([]);
    expect(countPermissions(setAllPermissions(PAGES, true))).toEqual({ selected: 6, total: 6 });
    expect(countPermissions(PAGES)).toEqual({ selected: 1, total: 6 });
  });

  it("should build user options from users with a username", () => {
    expect(buildUserOptions([{ username: "a" }, { username: "" }, {}] as never)).toEqual([{ label: "a", value: "a" }]);
  });

  it("should pick badge classes with a default", () => {
    expect(getPermissionBadgeClass("view")).toContain("information");
    expect(getPermissionBadgeClass("other")).toBe("border-action-primary text-action-primary");
  });

  it("should prefer the users error message", () => {
    expect(getPermissionErrorMessage(true, true)).toBe("Unable to load users.");
    expect(getPermissionErrorMessage(false, true)).toBe("Unable to load permissions.");
    expect(getPermissionErrorMessage(false, false)).toBeUndefined();
  });
});
