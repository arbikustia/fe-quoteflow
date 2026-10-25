import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { NAVIGATION_CONFIG } from "./Sidebar.config";
import { getInitialOpenMenus } from "./Sidebar.helpers";
import type { LogoutState, SidebarState } from "./Sidebar.type";

/**
 * Manage sidebar navigation and profile state.
 * @returns {SidebarState} Sidebar state and handlers
 */
export const useSidebarState = (): SidebarState => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>(() => getInitialOpenMenus(NAVIGATION_CONFIG, location.pathname));
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const onToggleMenu = useCallback((menuName: string): void => {
    setOpenMenus((previousMenus) => previousMenus.includes(menuName)
      ? previousMenus.filter((name) => name !== menuName)
      : [...previousMenus, menuName]);
  }, []);
  const onToggleCollapsed = useCallback((): void => {
    setIsCollapsed((collapsed) => !collapsed);
    setIsProfileOpen(false);
  }, []);
  const onToggleProfile = useCallback((): void => setIsProfileOpen((isOpen) => !isOpen), []);
  const onCloseProfile = useCallback((): void => setIsProfileOpen(false), []);

  return { currentPath: location.pathname, openMenus, onToggleMenu, isCollapsed, onToggleCollapsed, isProfileOpen, onToggleProfile, onCloseProfile, setOpenMenus };
};

/**
 * Manage logout confirmation and navigation.
 * @returns {LogoutState} Logout modal state and handlers
 */
export const useLogoutState = (): LogoutState => {
  const navigate = useNavigate();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const handleLogout = useCallback((): void => setIsLogoutConfirmOpen(true), []);
  const closeLogoutConfirm = useCallback((): void => setIsLogoutConfirmOpen(false), []);
  const confirmLogout = useCallback((): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login", { replace: true });
  }, [navigate]);

  return { isLogoutConfirmOpen, handleLogout, closeLogoutConfirm, confirmLogout };
};
