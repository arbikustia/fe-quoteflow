import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import { NAVIGATION_CONFIG } from "./Sidebar.config";

/**
 * Sidebar state hook — collapsed, profile dropdown, open menus.
 * @returns {object} state + handlers
 */
export const useSidebarState = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<readonly string[]>(() => {
    // auto-open menu if child matches path
    const activeSection = NAVIGATION_CONFIG.find((item: { readonly children?: readonly { readonly path: string }[] }) => 
      item.children?.some((child: { readonly path: string }) => location.pathname.startsWith(child.path))
    );
    return activeSection ? [activeSection.name] : [];
  });
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const onToggleMenu = useCallback((menuName: string): void => {
    setOpenMenus((prev) =>
      prev.includes(menuName) ? prev.filter((n) => n !== menuName) : [...prev, menuName],
    );
  }, []);

  const onToggleCollapsed = useCallback((): void => {
    setIsCollapsed((v) => !v);
    setIsProfileOpen(false);
  }, []);

  const onToggleProfile = useCallback((): void => {
    setIsProfileOpen((v) => !v);
  }, []);

  const onCloseProfile = useCallback((): void => {
    setIsProfileOpen(false);
  }, []);

  return {
    currentPath: location.pathname,
    openMenus,
    onToggleMenu,
    isCollapsed,
    onToggleCollapsed,
    isProfileOpen,
    onToggleProfile,
    onCloseProfile,
    setOpenMenus,
  };
};
