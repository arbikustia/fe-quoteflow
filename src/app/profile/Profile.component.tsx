import type { ReactElement } from "react";

import type { ProfileProps } from "./Profile.type";
import ConfirmModal from "../../components/ConfirmModal";
import { Icons } from "../../components/Icons";

/**
 * Render profile settings and current login identity.
 * @param {ProfileProps} props - Profile state and actions
 * @returns {ReactElement} Profile content
 */
export const ProfileComponent = ({ 
  username, 
  theme, 
  isLogoutConfirmOpen, 
  canInstall, 
  onInstall, 
  onToggleTheme, 
  onOpenLogoutConfirm, 
  onCloseLogoutConfirm, 
  onConfirmLogout 
}: ProfileProps): ReactElement => (
  <section className="w-full space-y-6" aria-label="Profile content">
    <div className="rounded-3xl border border-border-default bg-background-surface p-5 shadow-xs sm:p-6">
      <p className="mb-4 text-sm font-semibold text-text-secondary">Logged in as</p>
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-action-primary-subtle text-action-primary" aria-hidden="true"><Icons.User /></span>
        <div className="min-w-0">
          <p className="text-xs text-text-tertiary">Username</p>
          <p className="break-words text-base font-semibold text-text-primary">{username || "Username unavailable"}</p>
        </div>
      </div>
    </div>

    <div className="overflow-hidden rounded-3xl border border-border-default bg-background-surface shadow-xs">
      <h2 className="px-5 pt-5 pb-3 text-sm font-semibold text-text-secondary">Settings</h2>
      <button type="button" onClick={onToggleTheme} aria-label={`Theme mode: ${theme}. Switch to ${theme === "dark" ? "light" : "dark"} mode`} className="flex min-h-14 w-full items-center justify-between gap-4 border-t border-border-default px-5 py-4 text-left transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-focus-ring">
        <span className="flex items-center gap-3 text-sm font-medium text-text-primary">{theme === "dark" ? <Icons.Moon /> : <Icons.Sun />}Theme mode</span>
        <span className="text-sm text-text-secondary">{theme === "dark" ? "Dark" : "Light"}</span>
      </button>
      <button 
        type="button" 
        onClick={onInstall} 
        className="flex min-h-14 w-full cursor-pointer items-center gap-3 border-t border-border-default px-5 py-4 text-left text-sm font-medium text-action-primary transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-focus-ring"
      >
        <Icons.Download />{canInstall ? "Install App" : "Install App (Petunjuk)"}
      </button>
    </div>

    <button type="button" onClick={onOpenLogoutConfirm} className="flex min-h-14 w-full items-center gap-3 rounded-3xl border border-border-default bg-background-surface px-5 py-4 text-left text-sm font-medium text-danger-strong transition-colors hover:bg-danger-subtle focus-visible:outline-2 focus-visible:outline-focus-ring shadow-xs">
      <Icons.LogOut />Logout
    </button>
    <ConfirmModal isOpen={isLogoutConfirmOpen} onClose={onCloseLogoutConfirm} onConfirm={onConfirmLogout} title="Confirm logout" message="Are you sure you want to log out?" confirmText="Log out" cancelText="Cancel" isDestructive={true} />
  </section>
);
