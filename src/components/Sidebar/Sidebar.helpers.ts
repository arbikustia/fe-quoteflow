import type { NavigationItem, NavigationSection } from "./Sidebar.type";

/**
 * Read saved username from cookie.
 * @returns {string} Saved username or empty string
 */
export const getUsername = (): string => {
  const cookie = document.cookie.split("; ").find((entry) => entry.startsWith("quoteflow_username="));

  return cookie ? decodeURIComponent(cookie.split("=")[1] ?? "") : "";
};

/**
 * Check whether navigation contains sections.
 * @param {readonly NavigationItem[] | readonly NavigationSection[]} navigation - Navigation data
 * @returns {boolean} Whether navigation contains sections
 */
export const isNavigationSectionArray = (
  navigation: readonly NavigationItem[] | readonly NavigationSection[],
): navigation is readonly NavigationSection[] => navigation.length > 0 && "title" in navigation[0];

/**
 * Find menu name containing current path.
 * @param {readonly NavigationItem[]} navigation - Navigation items
 * @param {string} currentPath - Current browser path
 * @returns {readonly string[]} Initially open menu names
 */
export const getInitialOpenMenus = (
  navigation: readonly NavigationItem[],
  currentPath: string,
): readonly string[] => {
  const activeItem = navigation.find((item) => item.children?.some((child) => currentPath.startsWith(child.path)));

  return activeItem ? [activeItem.name] : [];
};

/**
 * Check whether navigation item is active.
 * @param {NavigationItem} item - Navigation item
 * @param {string} currentPath - Current browser path
 * @param {readonly string[]} openMenus - Open menu names
 * @returns {boolean} Whether item is active
 */
export const isMenuItemActive = (
  item: NavigationItem,
  currentPath: string,
  openMenus: readonly string[],
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
