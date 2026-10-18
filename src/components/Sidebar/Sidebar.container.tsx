import * as React from "react";
import { useNavigate } from "react-router-dom";

import { useTheme } from "../../store/theme.hook";
import { SidebarComponent } from "./Sidebar.component";
import { NAVIGATION_SECTIONS } from "./Sidebar.config";
import { useSidebarState } from "./Sidebar.hook";
import type { SidebarContainerProps } from "./Sidebar.type";

/**
 * Render Sidebar Container
 * @param {SidebarContainerProps} props - container props
 * @returns {React.ReactElement} - Sidebar Container
 */
const SidebarContainer = (props: SidebarContainerProps = {}): React.ReactElement => {
  const { isCollapsed = false } = props;
  const {
    currentPath,
    openMenus,
    onToggleMenu,
    isProfileOpen,
    onToggleProfile,
  } = useSidebarState();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const handleLogout = (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login", { replace: true });
  };

  return (
    <SidebarComponent
      navigation={NAVIGATION_SECTIONS}
      currentPath={currentPath}
      openMenus={openMenus}
      onToggleMenu={onToggleMenu}
      isCollapsed={isCollapsed}
      isProfileOpen={isProfileOpen}
      onToggleProfile={onToggleProfile}
      theme={theme}
      onToggleTheme={toggleTheme}
      onLogout={handleLogout}
    />
  );
};

export default SidebarContainer;
