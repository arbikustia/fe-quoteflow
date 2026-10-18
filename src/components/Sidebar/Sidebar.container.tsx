import * as React from "react";
import { useNavigate } from "react-router-dom";

import { useTheme } from "../../store/theme.hook";
import ConfirmModal from "../ConfirmModal";

import { SidebarComponent } from "./Sidebar.component";
import { NAVIGATION_SECTIONS } from "./Sidebar.config";
import { useSidebarState } from "./Sidebar.hook";
import type { SidebarContainerProps } from "./Sidebar.type";

/**
 * Render Sidebar Container
 * @param {SidebarContainerProps} props - container props
 * @returns {React.ReactElement} - Sidebar Container
 */
// ponytail: sidebar prop mapping stays local; extract when another layout shares it.
// eslint-disable-next-line max-lines-per-function
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
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = React.useState(false);
  /**
   * Open logout confirmation.
   * @returns {void} No return value
   */
  const handleLogout = (): void => setIsLogoutConfirmOpen(true);
  /**
   * Close logout confirmation.
   * @returns {void} No return value
   */
  const closeLogoutConfirm = (): void => setIsLogoutConfirmOpen(false);
  /**
   * Confirm logout and navigate to login.
   * @returns {void} No return value
   */
  const confirmLogout = (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login", { replace: true });
  };

  return (
    <>
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
      <ConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={closeLogoutConfirm}
        onConfirm={confirmLogout}
        title="Confirm logout"
        message="Are you sure you want to log out?"
        confirmText="Log out"
        cancelText="Cancel"
        isDestructive={true}
      />
    </>
  );
};

export default SidebarContainer;
