import type { ApiPermissionMenu, PermissionRow } from "./Permission.type";
import type { PermissionAction } from "./Permission.type";

/**
 * Flatten permission menus into table rows without changing backend order.
 * @param {ApiPermissionMenu[]} menus - Permission menus
 * @returns {PermissionRow[]} Permission table rows
 */
export const flattenPermissionMenus = (menus: ApiPermissionMenu[]): PermissionRow[] => menus.flatMap((menu) => (
  menu.pages.map((page) => ({
    id: `${menu.menu}-${page.url}-${page.page}`,
    menu: menu.menu,
    page: page.page,
    url: page.url,
    permission: page.permission,
  }))
));

/**
 * Filter permission rows by visible values.
 * @param {PermissionRow[]} rows - Permission rows
 * @param {string} searchTerm - Search term
 * @returns {PermissionRow[]} Matching permission rows
 */
export const filterPermissionRows = (rows: PermissionRow[], searchTerm: string): PermissionRow[] => {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  if (!normalizedSearchTerm) {
    return rows;
  }

  return rows.filter((row) => [row.menu, row.page, row.url, ...row.permission]
    .some((value) => value.toLowerCase().includes(normalizedSearchTerm)));
};

/**
 * Check if the user has permission for a specific action.
 * @param {PermissionRow[]} rows - Permission rows
 * @param {string} url - Target URL
 * @param {PermissionAction} action - Action to check
 * @returns {boolean} Whether action is permitted
 */
export const checkPermission = (rows: PermissionRow[], url: string, action: PermissionAction): boolean => {
  const row = rows.find((r) => r.url === url);
  return row ? row.permission.includes(action) : false;
};
