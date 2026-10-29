import * as React from "react";
import { useNavigate } from "react-router-dom";

import type { GlobalHeaderProps } from "./GlobalHeader.type";
import { getGreeting } from "./GlobalHeader.helpers";
import { useMobileProfileHeaderState } from "./GlobalHeader.hook";

import Drawer from "../../components/Drawer";
import { Icons } from "../../components/Icons";
import ConfirmModal from "../../components/ConfirmModal";
import { getUsername } from "../../components/Sidebar/Sidebar.helpers";
import { useTheme } from "../../store/theme.hook";

/**
 * Render mobile application header.
 * @param {GlobalHeaderProps} props - header configuration
 * @returns {React.ReactElement} mobile header
 */
export default function GlobalHeader({ showCreateButton = false, createEndpoint = "" }: GlobalHeaderProps): React.ReactElement {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const {
    isDrawerOpen,
    isLogoutConfirmOpen,
    onCloseDrawer,
    onCloseLogoutConfirm,
    onConfirmLogout,
    onOpenDrawer,
    onOpenLogoutConfirm,
  } = useMobileProfileHeaderState();
  const displayName = getUsername() || "User";
  const greeting = getGreeting(new Date().getHours());

  const profileDrawer = (
    <Drawer isOpen={isDrawerOpen} onClose={onCloseDrawer} title={displayName} height="50vh">
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-14 items-center justify-between rounded-xl bg-background-subtle px-4 text-base font-medium text-text-primary"
        >
          <span>Theme mode</span>
          <span className="flex items-center gap-2 text-text-secondary">
            {theme === "dark" ? <Icons.Moon /> : <Icons.Sun />}
            {theme === "dark" ? "Dark" : "Light"}
          </span>
        </button>
        <button
          type="button"
          onClick={onOpenLogoutConfirm}
          className="flex h-14 items-center gap-3 rounded-xl bg-danger-subtle px-4 text-base font-medium text-danger-strong"
        >
          <Icons.LogOut />
          <span>Logout</span>
        </button>
      </div>
    </Drawer>
  );

  const logoutConfirmation = (
    <ConfirmModal
      isOpen={isLogoutConfirmOpen}
      onClose={onCloseLogoutConfirm}
      onConfirm={onConfirmLogout}
      title="Confirm logout"
      message="Are you sure you want to log out?"
      confirmText="Log out"
      cancelText="Cancel"
      isDestructive={true}
    />
  );

  return (
    <header className="flex items-center justify-between bg-background-surface px-4 py-4">
      <div className="min-w-0">
        <p className="text-xl font-medium text-text-tertiary">{greeting}</p>
        <p className="truncate text-3xl font-semibold text-text-primary">{displayName}</p>
      </div>
      <div className="flex items-center gap-2">
        {showCreateButton && createEndpoint && (
          <button
            type="button"
            onClick={() => navigate(createEndpoint)}
            className="flex h-10 items-center justify-center gap-2 rounded-full bg-action-primary px-4 text-sm font-medium text-text-inverse transition-colors hover:bg-action-primary-hover"
          >
            <Icons.Plus />
            <span>Create</span>
          </button>
        )}
        <button
          type="button"
          onClick={onOpenDrawer}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-action-primary-subtle text-action-primary transition-colors hover:bg-action-primary hover:text-text-inverse [&>svg]:h-9 [&>svg]:w-9"
          aria-label="Open user profile"
        >
          <Icons.User />
        </button>
      </div>
      {profileDrawer}
      {logoutConfirmation}
    </header>
  );
}
