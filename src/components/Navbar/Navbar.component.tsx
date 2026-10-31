import * as React from "react";

import { Icons } from "../Icons";

import type { NavbarProps } from "./Navbar.type";

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
      </div>
      <time data-testid="navbar-realtime-clock" className="text-lg font-semibold tracking-wide text-text-primary tabular-nums sm:text-3xl">{currentTime}</time>
    </header>
  );
};
