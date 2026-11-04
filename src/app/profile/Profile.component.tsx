import type { ReactElement } from "react";

import type { ProfileProps } from "./Profile.type";
import ConfirmModal from "../../components/ConfirmModal";
import { Icons } from "../../components/Icons";

/**
 * Render account identity panel.
 * @param {string | null} username - Current username
 * @returns {ReactElement} Identity panel
 */
const _renderIdentity = (username: string | null): ReactElement => (
  <section className="rounded-3xl border border-border-default bg-background-surface p-6 shadow-xs lg:p-8" aria-labelledby="profile-account-title">
    <h2 id="profile-account-title" className="text-xl font-semibold text-text-primary">Account information</h2>
    <p className="mt-1 text-sm text-text-secondary">Current account used to access QuoteFlow.</p>
    <div className="mt-6 flex items-center gap-4 border-t border-border-default pt-6 lg:flex-col lg:items-start">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-action-primary-subtle text-action-primary [&_svg]:h-6 [&_svg]:w-6" aria-hidden="true"><Icons.User /></span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-tertiary">Username</p>
        <p className="mt-1 break-words text-xl font-semibold text-text-primary">{username || "Username unavailable"}</p>
      </div>
    </div>
  </section>
);

/**
 * Render preference controls.
 * @param {ProfileProps} props - Profile state and actions
 * @returns {ReactElement} Preferences panel
 */
const _renderPreferences = (props: ProfileProps): ReactElement => (
  <section className="overflow-hidden rounded-3xl border border-border-default bg-background-surface shadow-xs" aria-labelledby="profile-preferences-title">
    <div className="px-6 py-5 lg:px-8 lg:py-6">
      <h2 id="profile-preferences-title" className="text-xl font-semibold text-text-primary">Preferences</h2>
      <p className="mt-1 text-sm text-text-secondary">Adjust application appearance and installation.</p>
    </div>
    <button type="button" onClick={props.onToggleTheme} aria-label={`Theme mode: ${props.theme}. Switch to ${props.theme === "dark" ? "light" : "dark"} mode`} className="flex min-h-16 w-full items-center justify-between gap-4 border-t border-border-default px-6 py-4 text-left transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring lg:px-8">
      <span className="flex items-center gap-4 text-base font-medium text-text-primary"><span className="text-text-secondary" aria-hidden="true">{props.theme === "dark" ? <Icons.Moon /> : <Icons.Sun />}</span>Theme mode</span>
      <span className="rounded-full bg-background-subtle px-3 py-1 text-sm font-medium text-text-secondary">{props.theme === "dark" ? "Dark" : "Light"}</span>
    </button>
    <button type="button" onClick={props.onInstall} className="flex min-h-16 w-full items-center justify-between gap-4 border-t border-border-default px-6 py-4 text-left transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring lg:px-8">
      <span className="flex items-center gap-4 text-base font-medium text-text-primary"><span className="text-text-secondary" aria-hidden="true"><Icons.Download /></span>Install application</span>
      <span className="text-sm font-medium text-action-primary">{props.canInstall ? "Install" : "View instructions"}</span>
    </button>
  </section>
);

/**
 * Render session controls.
 * @param {ProfileProps} props - Profile state and actions
 * @returns {ReactElement} Session panel
 */
const _renderSession = (props: ProfileProps): ReactElement => (
  <section className="rounded-3xl border border-border-default bg-background-surface p-6 shadow-xs lg:flex lg:items-center lg:justify-between lg:gap-6 lg:p-8" aria-labelledby="profile-session-title">
    <div>
      <h2 id="profile-session-title" className="text-xl font-semibold text-text-primary">Session</h2>
      <p className="mt-1 text-sm text-text-secondary">End current session on this device.</p>
    </div>
    <button type="button" onClick={props.onOpenLogoutConfirm} className="mt-5 flex h-14 w-full items-center justify-center gap-3 rounded-3xl border border-danger-default px-6 text-base font-semibold text-danger-strong transition-colors hover:bg-danger-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring lg:mt-0 lg:w-auto">
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
  <section className="grid w-full gap-6 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.6fr)] lg:items-start" aria-label="Profile content">
    {_renderIdentity(props.username)}
    <div className="space-y-6">
      {_renderPreferences(props)}
      {_renderSession(props)}
    </div>
    <ConfirmModal isOpen={props.isLogoutConfirmOpen} onClose={props.onCloseLogoutConfirm} onConfirm={props.onConfirmLogout} title="Confirm logout" message="Are you sure you want to log out?" confirmText="Log out" cancelText="Cancel" isDestructive={true} />
  </section>
);
