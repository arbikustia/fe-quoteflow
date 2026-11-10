import { NAVIGATION_CONFIG } from "@/components/Sidebar/Sidebar.config";
import type { NavigationItem } from "@/components/Sidebar/Sidebar.type";

import type { PermissionFormPage, PermissionPayload } from "./Permission.type";

const EXCLUDED_PATHS = new Set(["/permission"]);

/** Build editable pages from the desktop sidebar routing source. */
export const getPermissionPages = (): PermissionFormPage[] => NAVIGATION_CONFIG.flatMap((item: NavigationItem, index: number) => {
  const number = index + 1;

  if (item.children) {
    return item.children
      .filter((child) => !EXCLUDED_PATHS.has(child.path))
      .map((child) => ({ menu: item.name, number, page: child.name, url: child.path, permission: [] }));
  }

  if (!item.path || EXCLUDED_PATHS.has(item.path)) return [];

  return [{ menu: item.name, number, page: item.name, url: item.path, permission: [] }];
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
