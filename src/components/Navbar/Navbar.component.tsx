import * as React from "react";

import { Icons } from "../Icons";

import type { NavbarProps } from "./Navbar.type";

/**
 * Render navbar search field.
 * @returns {React.ReactElement} Search field
 */
const _renderSearch = (): React.ReactElement => (
  <div className="group relative hidden max-w-lg flex-1 md:block">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-tertiary">
      <Icons.Search />
    </div>
    <input type="text" placeholder="Search anything" aria-label="Search anything" className="w-full rounded-lg border border-border-default bg-background-surface py-2.5 pl-10 pr-12 text-sm font-medium text-text-primary transition-all placeholder:text-text-tertiary focus:border-action-primary focus:outline-none focus:ring-1 focus:ring-action-primary" />
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <span className="rounded border border-border-default bg-background-subtle px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary">⌘K</span>
    </div>
  </div>
);

/**
 * Render Navbar Component.
 * @param {NavbarProps} props - navbar component props
 * @returns {React.ReactElement} NavbarComponent
 */
export const NavbarComponent = (props: NavbarProps): React.ReactElement => {
  const { isSidebarCollapsed, onToggleSidebar, currentTime } = props;

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-border-default bg-background-surface px-8 transition-all">
      <div className="flex flex-1 items-center gap-4">
        <button type="button" onClick={onToggleSidebar} aria-label={isSidebarCollapsed ? "Open sidebar" : "Close sidebar"} aria-expanded={!isSidebarCollapsed} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-default bg-background-surface text-text-secondary transition-colors hover:bg-background-subtle hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30">
          <Icons.SidebarToggle />
        </button>
        {_renderSearch()}
      </div>
      <time data-testid="navbar-realtime-clock" className="text-lg font-semibold tracking-wide text-text-primary tabular-nums sm:text-3xl">{currentTime}</time>
    </header>
  );
};
