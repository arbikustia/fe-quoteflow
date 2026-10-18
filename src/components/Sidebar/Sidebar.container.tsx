import * as React from "react";

import { useTheme } from "../../store/theme.hook";
import ConfirmModal from "../ConfirmModal";

import { SidebarComponent } from "./Sidebar.component";
import { NAVIGATION_SECTIONS } from "./Sidebar.config";
import { useLogoutState, useSidebarState } from "./Sidebar.hook";
import type { LogoutState, SidebarContainerProps } from "./Sidebar.type";

/**
 * Render logout confirmation modal.
 * @param {LogoutState} props - logout modal state
 * @returns {React.ReactElement} - ConfirmModal element
 */
const _renderLogoutConfirmModal = (props: LogoutState): React.ReactElement => (
  <ConfirmModal
    isOpen={props.isLogoutConfirmOpen}
    onClose={props.closeLogoutConfirm}
    onConfirm={props.confirmLogout}
    title="Confirm logout"
    message="Are you sure you want to log out?"
    confirmText="Log out"
    cancelText="Cancel"
    isDestructive={true}
  />
);

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
  const logoutState = useLogoutState();

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
        onLogout={logoutState.handleLogout}
      />
      {_renderLogoutConfirmModal(logoutState)}
    </>
  );
};

export default SidebarContainer;
