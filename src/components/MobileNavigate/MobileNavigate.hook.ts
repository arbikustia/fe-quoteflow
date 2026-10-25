import type {
  MobileNavigateHookResult,
  MobileNavigateItem,
  MobileNavigateResolvedItem,
} from "./MobileNavigate.type";

/**
 * Determine whether a mobile navigation tab corresponds to current route.
 * @param {string} tabId - tab destination route
 * @param {string} path - current browser route
 * @returns {boolean} whether tab is active
 */
export const _isTabActive = (tabId: string, path: string): boolean => {
  if (tabId === "/report/main") {
    return path.startsWith("/report");
  }

  if (tabId === "/master-main") {
    return path === "/master-main";
  }

  return path === tabId || path.startsWith(tabId + "/");
};

/**
 * Build mobile navigation items with route state.
 * @param {string} currentPath - current browser route
 * @returns {MobileNavigateHookResult} resolved navigation item builder
 */
export const useMobileNavigate = (currentPath: string): MobileNavigateHookResult => {
  /**
   * Resolve navigation items with active route state.
   * @param {MobileNavigateItem[]} items - navigation items
   * @returns {MobileNavigateResolvedItem[]} resolved navigation items
   */
  const getItems = (
    items: MobileNavigateItem[],
  ): MobileNavigateResolvedItem[] => items.map((item) => ({
    ...item,
    isActive: _isTabActive(item.id, currentPath),
  }));

  return { getItems };
};
