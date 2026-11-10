import type { PermissionRow } from "@/modules/permission/Permission.type";

import type { AccessTokenPayload, NavigationItem, NavigationSection, RoleIdentity, UserRoleIdentity, UserRoleValue } from "./Sidebar.type";

/**
 * Read saved username from cookie.
 * @returns {string} Saved username or empty string
 */
export const getUsername = (): string => {
  const cookie = document.cookie.split("; ").find((entry) => entry.startsWith("quoteflow_username="));

  return cookie ? decodeURIComponent(cookie.split("=")[1] ?? "") : "";
};

/**
 * Read role names or ids from login JWT claims.
 * @returns {string[]} Login role values
 */
export const getAccessTokenRoles = (): string[] => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return [];
  }

  try {
    const payload: AccessTokenPayload = JSON.parse(atob(token.split(".")[1] ?? ""));
    const claimValues = [
      payload.role,
      payload.roles,
      payload.role_id,
      payload.roleId,
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    ];

    return claimValues.flatMap((value) => {
      if (Array.isArray(value)) {
        return value;
      }

      return value ? [value] : [];
    });
  } catch {
    return [];
  }
};

/**
 * Find role for the exact authenticated username.
 * @param {UserRoleIdentity[]} users - User search results
 * @param {string} username - Authenticated username
 * @returns {UserRoleValue} Exact user's role
 */
export const findUserRole = (users: UserRoleIdentity[], username: string): UserRoleValue => (
  users.find((user) => user.username?.toLowerCase() === username.toLowerCase())?.role
);

/**
 * Normalize one API role value to a list.
 * @param {UserRoleValue} role - User role value
 * @returns {string[]} Role values
 */
export const normalizeUserRoles = (role: UserRoleValue): string[] => {
  if (Array.isArray(role)) {
    return role;
  }

  return role ? [role] : [];
};

/**
 * Match direct role names or resolve role ids through role master data.
 * @param {string[]} userRoles - User role names or ids
 * @param {RoleIdentity[]} roles - Master role options
 * @returns {boolean} Whether user is superadmin
 */
export const isSuperadminRole = (userRoles: string[], roles: RoleIdentity[]): boolean => userRoles.some((userRole) => (
  userRole.toLowerCase() === "superadmin"
  || roles.some((role) => role.id === userRole && role.role.toLowerCase() === "superadmin")
));

/**
 * Filter role-restricted sidebar items.
 * @param {NavigationSection[]} sections - Sidebar sections
 * @param {string} role - Current user role
 * @returns {NavigationSection[]} Allowed sidebar sections
 */
export const getNavigationSectionsForRole = (
  sections: NavigationSection[],
  role: string,
): NavigationSection[] => sections.map((section) => ({
  ...section,
  items: section.items.filter((item) => item.path !== "/permission" || role.toLowerCase() === "superadmin"),
}));

export const filterNavigationByPermission = (sections: NavigationSection[], rows: PermissionRow[]): NavigationSection[] => sections.map((section) => ({
  ...section,
  items: section.items.map((item) => {
    if (!item.children) {
      if (!item.path) return item;
      const row = rows.find((r) => r.url === item.path);
      return row?.permission.includes("view") ? item : null;
    }
    const filteredChildren = item.children.filter((child) => {
      const row = rows.find((r) => r.url === child.path);
      return row?.permission.includes("view");
    });
    return filteredChildren.length > 0 ? { ...item, children: filteredChildren } : null;
  }).filter((item): item is NavigationItem => item !== null),
}));

/**
 * Check whether navigation contains sections.
 * @param {NavigationItem[] | NavigationSection[]} navigation - Navigation data
 * @returns {boolean} Whether navigation contains sections
 */
export const isNavigationSectionArray = (
  navigation: NavigationItem[] | NavigationSection[],
): navigation is NavigationSection[] => navigation.length > 0 && "title" in navigation[0];

/**
 * Find menu name containing current path.
 * @param {NavigationItem[]} navigation - Navigation items
 * @param {string} currentPath - Current browser path
 * @returns {string[]} Initially open menu names
 */
export const getInitialOpenMenus = (
  navigation: NavigationItem[],
  currentPath: string,
): string[] => {
  const activeItem = navigation.find((item) => item.children?.some((child) => currentPath.startsWith(child.path)));

  return activeItem ? [activeItem.name] : [];
};

/**
 * Check whether navigation item is active.
 * @param {NavigationItem} item - Navigation item
 * @param {string} currentPath - Current browser path
 * @param {string[]} openMenus - Open menu names
 * @returns {boolean} Whether item is active
 */
export const isMenuItemActive = (
  item: NavigationItem,
  currentPath: string,
  openMenus: string[],
): boolean => {
  if (!item.children?.length) {
    return Boolean(item.path && (currentPath === item.path || currentPath.startsWith(`${item.path}/`)));
  }

  return openMenus.includes(item.name) || item.children.some((child) => currentPath === child.path || currentPath.startsWith(`${child.path}/`));
};

/**
 * Check whether navigation child is active.
 * @param {string} childPath - Navigation child path
 * @param {string} currentPath - Current browser path
 * @returns {boolean} Whether child is active
 */
export const isNavigationChildActive = (childPath: string, currentPath: string): boolean => (
  currentPath === childPath || currentPath.startsWith(`${childPath}/`)
);
