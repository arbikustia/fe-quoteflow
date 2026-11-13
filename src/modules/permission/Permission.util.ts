import type { SelectOption } from "@/components/Select/Select.type";
import { NAVIGATION_CONFIG } from "@/components/Sidebar/Sidebar.config";
import type { NavigationItem } from "@/components/Sidebar/Sidebar.type";

import {
  DEFAULT_PERMISSION_BADGE_CLASS,
  EXCLUDED_PATHS,
  PERMISSION_ACTIONS,
  PERMISSION_BADGE_CLASSES,
  RESTRICTED_PAGE_ACTIONS,
} from "./Permission.config";
import type {
  ApiPermissionMenu,
  PermissionAction,
  PermissionCounts,
  PermissionFormPage,
  PermissionPayload,
  PermissionPayloadMenu,
  PermissionRow,
} from "./Permission.type";

import type { ApiUser } from "@/modules/master-data/master-user/MasterUser.type";

/**
 * Get the actions a page can be granted.
 * @param {string} url - Page URL
 * @returns {PermissionAction[]} - Allowed actions
 */
const _getPageActions = (url: string): PermissionAction[] => RESTRICTED_PAGE_ACTIONS.get(url) ?? PERMISSION_ACTIONS;

/**
 * Build editable pages from the desktop sidebar routing source.
 * @returns {PermissionFormPage[]} - Pages without granted permissions
 */
export const getPermissionPages = (): PermissionFormPage[] => NAVIGATION_CONFIG.flatMap((item: NavigationItem, index: number) => {
  const number = index + 1;

  if (item.children) {
    return item.children
      .filter((child) => !EXCLUDED_PATHS.has(child.path))
      .map((child) => ({ menu: item.name, number, page: child.name, url: child.path, actions: _getPageActions(child.path), permission: [] }));
  }

  if (!item.path || EXCLUDED_PATHS.has(item.path)) {
    return [];
  }

  return [{ menu: item.name, number, page: item.name, url: item.path, actions: _getPageActions(item.path), permission: [] }];
});

/**
 * Group selected pages into the API POST contract.
 * @param {string} username - Target username
 * @param {PermissionFormPage[]} pages - Form pages
 * @returns {PermissionPayload} - POST payload
 */
export const buildPermissionPayload = (username: string, pages: PermissionFormPage[]): PermissionPayload => ({
  username,
  menus: pages.reduce<PermissionPayloadMenu[]>((menus, page) => {
    if (page.permission.length === 0) {
      return menus;
    }

    const existing = menus.find((menu) => menu.menu === page.menu);
    const payloadPage = { page: page.page, url: page.url, permission: page.permission };

    if (existing) {
      existing.pages.push(payloadPage);

      return menus;
    }

    return [...menus, { menu: page.menu, number: page.number, pages: [payloadPage] }];
  }, []),
});

/**
 * Flatten permission menus into table rows without changing backend order.
 * @param {ApiPermissionMenu[]} menus - Permission menus
 * @returns {PermissionRow[]} - Permission table rows
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
 * @returns {PermissionRow[]} - Matching permission rows
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
 * @returns {boolean} - Whether action is permitted
 */
export const checkPermission = (rows: PermissionRow[], url: string, action: PermissionAction): boolean => {
  const row = rows.find((candidate) => candidate.url === url);

  return row ? row.permission.includes(action) : false;
};

/**
 * Merge current API permissions into sidebar page definitions.
 * @param {PermissionFormPage[]} pages - Form pages
 * @param {PermissionRow[]} rows - Current permission rows
 * @returns {PermissionFormPage[]} - Pages with granted permissions
 */
export const mergePermissions = (pages: PermissionFormPage[], rows: PermissionRow[]): PermissionFormPage[] => pages.map((page) => {
  const current = rows.find((row) => row.url === page.url);

  return { ...page, permission: page.actions.filter((action) => current?.permission.includes(action)) };
});

/**
 * Grant or revoke one action on one page.
 * @param {PermissionFormPage[]} pages - Form pages
 * @param {string} url - Page URL
 * @param {PermissionAction} permission - Action to change
 * @param {boolean} checked - Whether to grant the action
 * @returns {PermissionFormPage[]} - Updated pages
 */
export const togglePermission = (pages: PermissionFormPage[], url: string, permission: PermissionAction, checked: boolean): PermissionFormPage[] =>
  pages.map((page) => {
    if (page.url !== url) {
      return page;
    }

    const others = page.permission.filter((action) => action !== permission);

    return { ...page, permission: checked ? [...others, permission] : others };
  });

/**
 * Grant or revoke every action on one page.
 * @param {PermissionFormPage[]} pages - Form pages
 * @param {string} url - Page URL
 * @param {boolean} checked - Whether to grant all actions
 * @returns {PermissionFormPage[]} - Updated pages
 */
export const setRowPermissions = (pages: PermissionFormPage[], url: string, checked: boolean): PermissionFormPage[] =>
  pages.map((page) => (page.url === url ? { ...page, permission: checked ? [...page.actions] : [] } : page));

/**
 * Grant or revoke every action on every page.
 * @param {PermissionFormPage[]} pages - Form pages
 * @param {boolean} checked - Whether to grant all actions
 * @returns {PermissionFormPage[]} - Updated pages
 */
export const setAllPermissions = (pages: PermissionFormPage[], checked: boolean): PermissionFormPage[] =>
  pages.map((page) => ({ ...page, permission: checked ? [...page.actions] : [] }));

/**
 * Count granted and grantable actions.
 * @param {PermissionFormPage[]} pages - Form pages
 * @returns {PermissionCounts} - Selected and total counts
 */
export const countPermissions = (pages: PermissionFormPage[]): PermissionCounts => ({
  selected: pages.reduce((total, page) => total + page.permission.length, 0),
  total: pages.reduce((total, page) => total + page.actions.length, 0),
});

/**
 * Build user select options from usernames.
 * @param {ApiUser[]} users - Users
 * @returns {SelectOption[]} - Select options
 */
export const buildUserOptions = (users: ApiUser[]): SelectOption[] => users
  .filter((user) => Boolean(user.username))
  .map((user) => ({ label: user.username ?? "", value: user.username ?? "" }));

/**
 * Pick the badge classes of a permission action.
 * @param {string} action - Permission action
 * @returns {string} - Badge class names
 */
export const getPermissionBadgeClass = (action: string): string =>
  PERMISSION_BADGE_CLASSES.find((badge) => badge.action === action)?.className ?? DEFAULT_PERMISSION_BADGE_CLASS;

/**
 * Pick the page error message from the failed requests.
 * @param {boolean} isUsersError - Whether loading users failed
 * @param {boolean} isPermissionError - Whether loading permissions failed
 * @returns {string | undefined} - Error message, or undefined when none
 */
export const getPermissionErrorMessage = (isUsersError: boolean, isPermissionError: boolean): string | undefined => {
  if (isUsersError) {
    return "Unable to load users.";
  }

  return isPermissionError ? "Unable to load permissions." : undefined;
};
