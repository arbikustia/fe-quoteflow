import { filterNavigationByPermission, findUserRole, getAccessTokenRoles, getNavigationSectionsForRole, isSuperadminRole } from "./Sidebar.helpers";
import type { NavigationSection } from "./Sidebar.type";

const sections: NavigationSection[] = [
  {
    title: "Menu",
    items: [
      { name: "Dashboard", path: "/home", icon: "div" },
      { name: "Permission", path: "/permission", icon: "div" },
    ],
  },
];

describe("getNavigationSectionsForRole", () => {
  it("should include permission for superadmin", () => {
    expect(getNavigationSectionsForRole(sections, "SUPERADMIN")[0].items).toHaveLength(2);
  });

  it("should hide permission for other roles", () => {
    expect(getNavigationSectionsForRole(sections, "admin")[0].items).toHaveLength(1);
  });
});

describe("filterNavigationByPermission", () => {
  it("should hide master data pages without view access", () => {
    const navigation: NavigationSection[] = [{
      title: "Menu",
      items: [{ name: "Master Data", icon: "div", children: [
        { name: "Customer", path: "/master-customer", icon: "div" },
        { name: "Category", path: "/master-category", icon: "div" },
      ] }],
    }];

    const filtered = filterNavigationByPermission(navigation, [{ id: "1", menu: "Master Data", page: "Customer", url: "/master-customer", permission: ["view"] }]);

    expect(filtered[0].items[0].children?.map((child) => child.name)).toEqual(["Customer"]);
  });

  it("should hide empty parent menus", () => {
    const navigation: NavigationSection[] = [{
      title: "Menu",
      items: [{ name: "Master Data", icon: "div", children: [{ name: "Customer", path: "/master-customer", icon: "div" }] }],
    }];

    expect(filterNavigationByPermission(navigation, [])[0].items).toEqual([]);
  });
});

describe("findUserRole", () => {
  it("should match arbi instead of the partial arbika result", () => {
    expect(findUserRole([
      { username: "arbika", role: "staf" },
      { username: "arbi", role: "superadmin" },
    ], "arbi")).toBe("superadmin");
  });
});

describe("getAccessTokenRoles", () => {
  it("should read role names and ids from login token claims", () => {
    const payload = btoa(JSON.stringify({ role: "SuperAdmin", role_id: "role-1" }));
    localStorage.setItem("access_token", `header.${payload}.signature`);

    expect(getAccessTokenRoles()).toEqual(["SuperAdmin", "role-1"]);
  });
});

describe("isSuperadminRole", () => {
  it("should match a direct role name", () => {
    expect(isSuperadminRole(["SUPERADMIN"], [])).toBe(true);
  });

  it("should resolve a role id by role name", () => {
    expect(isSuperadminRole(["role-1"], [{ id: "role-1", role: "SuperAdmin", status: 1 }])).toBe(true);
  });

  it("should reject an id belonging to another role", () => {
    expect(isSuperadminRole(["role-2"], [{ id: "role-2", role: "Admin", status: 1 }])).toBe(false);
  });
});
