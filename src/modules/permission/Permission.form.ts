import { NAVIGATION_CONFIG } from "@/components/Sidebar/Sidebar.config";
import type { NavigationItem } from "@/components/Sidebar/Sidebar.type";

import type { PermissionAction, PermissionFormPage, PermissionPayload } from "./Permission.type";

const EXCLUDED_PATHS = new Set(["/permission"]);
export const PERMISSION_ACTIONS: PermissionAction[] = ["view", "create", "edit"];
// Pages that support fewer actions: Dashboard/Calendar/Activity Log/Report are read-only, Mail has no edit.
const RESTRICTED_PAGE_ACTIONS = new Map<string, PermissionAction[]>([
  ["/home", ["view"]],
  ["/calendar", ["view"]],
  ["/activity-log", ["view"]],
  ["/report", ["view"]],
  ["/mail", ["view", "create"]],
]);

/**
 * Get the actions a page can be granted.
 * @param {string} url - Page URL
 * @returns {PermissionAction[]} Allowed actions
 */
const _getPageActions = (url: string): PermissionAction[] => RESTRICTED_PAGE_ACTIONS.get(url) ?? PERMISSION_ACTIONS;

/** Build editable pages from the desktop sidebar routing source. */
export const getPermissionPages = (): PermissionFormPage[] => NAVIGATION_CONFIG.flatMap((item: NavigationItem, index: number) => {
  const number = index + 1;

  if (item.children) {
    return item.children
      .filter((child) => !EXCLUDED_PATHS.has(child.path))
      .map((child) => ({ menu: item.name, number, page: child.name, url: child.path, actions: _getPageActions(child.path), permission: [] }));
  }

  if (!item.path || EXCLUDED_PATHS.has(item.path)) return [];

  return [{ menu: item.name, number, page: item.name, url: item.path, actions: _getPageActions(item.path), permission: [] }];
});

/** Group selected pages into the API POST contract. */
export const buildPermissionPayload = (username: string, pages: PermissionFormPage[]): PermissionPayload => ({
  username,
  menus: pages.reduce<PermissionPayload["menus"]>((menus, page) => {
    if (page.permission.length === 0) return menus;

    const existing = menus.find((menu) => menu.menu === page.menu);
    const payloadPage = { page: page.page, url: page.url, permission: page.permission };

    if (existing) existing.pages.push(payloadPage);
    else menus.push({ menu: page.menu, number: page.number, pages: [payloadPage] });

    return menus;
  }, []),
});
