import type { ReactElement } from "react";

import type { ProfileProps } from "./Profile.type";
import ConfirmModal from "../../components/ConfirmModal";
import { Icons } from "../../components/Icons";

/**
 * Render logged-in user summary.
 * @param {string | null} username - Current username
 * @returns {ReactElement} User summary
 */
const _renderUserSummary = (username: string | null): ReactElement => (
  <section className="flex w-full items-center gap-4 rounded-2xl border border-border-default bg-background-surface p-6 shadow-xs lg:px-8" aria-labelledby="profile-user-title">
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-action-primary-subtle text-action-primary" aria-hidden="true"><Icons.User /></span>
    <div className="min-w-0">
      <p className="text-sm text-text-secondary">Logged in as</p>
      <h2 id="profile-user-title" className="mt-1 truncate text-lg font-semibold text-text-primary">{username || "Username unavailable"}</h2>
    </div>
  </section>
);

/**
 * Render preference controls.
 * @param {ProfileProps} props - Profile state and actions
 * @returns {ReactElement} Preferences panel
 */
const _renderPreferences = (props: ProfileProps): ReactElement => (
  <section className="overflow-hidden rounded-2xl border border-border-default bg-background-surface shadow-xs" aria-labelledby="profile-preferences-title">
    <div className="border-b border-border-default px-6 py-5 lg:px-8 lg:py-6">
      <h2 id="profile-preferences-title" className="text-xl font-semibold tracking-tight text-text-primary">Preferences</h2>
      <p className="mt-1 text-sm leading-6 text-text-secondary">Customize how QuoteFlow works on this device.</p>
    </div>
    <div className="divide-y divide-border-default">
      <button type="button" onClick={props.onToggleTheme} aria-label={`Theme mode: ${props.theme}. Switch to ${props.theme === "dark" ? "light" : "dark"} mode`} className="group flex min-h-20 w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring lg:px-8">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-default bg-background-subtle text-text-secondary group-hover:text-action-primary" aria-hidden="true">{props.theme === "dark" ? <Icons.Moon /> : <Icons.Sun />}</span>
        <span className="min-w-0 flex-1"><span className="block text-base font-semibold text-text-primary">Theme mode</span><span className="mt-1 block text-sm text-text-secondary">Switch between light and dark appearance.</span></span>
        <span className="rounded-full border border-border-default bg-background-page px-3 py-1 text-sm font-medium text-text-secondary">{props.theme === "dark" ? "Dark" : "Light"}</span>
      </button>
      <button type="button" onClick={props.onInstall} className="group flex min-h-20 w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring lg:px-8">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-default bg-background-subtle text-text-secondary group-hover:text-action-primary" aria-hidden="true"><Icons.Download /></span>
        <span className="min-w-0 flex-1"><span className="block text-base font-semibold text-text-primary">Install application</span><span className="mt-1 block text-sm text-text-secondary">Open QuoteFlow faster from your desktop.</span></span>
        <span className="text-sm font-semibold text-action-primary">{props.canInstall ? "Install" : "Instructions"}</span>
      </button>
      {props.canManagePermissions && (
        <button type="button" aria-label="Permission" onClick={props.onOpenPermission} className="group flex min-h-20 w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring lg:hidden">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-default bg-background-subtle text-text-secondary group-hover:text-action-primary" aria-hidden="true"><Icons.Settings /></span>
          <span className="min-w-0 flex-1"><span className="block text-base font-semibold text-text-primary">Permission</span><span className="mt-1 block text-sm text-text-secondary">Manage user menu and page access.</span></span>
          <span className="text-action-primary" aria-hidden="true"><Icons.ChevronRight /></span>
        </button>
      )}
    </div>
  </section>
);

/**
 * Render session controls.
 * @param {ProfileProps} props - Profile state and actions
 * @returns {ReactElement} Session panel
 */
const _renderSession = (props: ProfileProps): ReactElement => (
  <section className="rounded-2xl border border-border-default bg-background-surface p-6 shadow-xs lg:flex lg:items-center lg:justify-between lg:gap-8 lg:p-8" aria-labelledby="profile-session-title">
    <div className="max-w-xl">
      <h2 id="profile-session-title" className="text-xl font-semibold tracking-tight text-text-primary">Session</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">Sign out from QuoteFlow on this device. You will need to enter your credentials again.</p>
    </div>
    <button type="button" onClick={props.onOpenLogoutConfirm} className="mt-5 flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-danger-default px-5 text-sm font-semibold text-danger-strong transition-colors hover:bg-danger-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring lg:mt-0 lg:w-auto">
      <Icons.LogOut />Log out
    </button>
  </section>
);

/**
 * Render profile settings and current login identity.
 * @param {ProfileProps} props - Profile state and actions
 * @returns {ReactElement} Profile content
 */
export const ProfileComponent = (props: ProfileProps): ReactElement => (
  <section className="w-full space-y-6" aria-label="Profile content">
    {_renderUserSummary(props.username)}
    {_renderPreferences(props)}
    {_renderSession(props)}
    <ConfirmModal isOpen={props.isLogoutConfirmOpen} onClose={props.onCloseLogoutConfirm} onConfirm={props.onConfirmLogout} title="Confirm logout" message="Are you sure you want to log out?" confirmText="Log out" cancelText="Cancel" isDestructive={true} />
  </section>
);
