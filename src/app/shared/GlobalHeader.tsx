import * as React from "react";
import { useNavigate } from "react-router-dom";

import type { GlobalHeaderProps } from "./GlobalHeader.type";

import { Icons } from "../../components/Icons";
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
  const displayName = getUsername() || "User";

  return (
    <header className="flex items-center justify-between bg-background-surface px-4 py-4">
      <div className="min-w-0">
        <p className="text-xl font-medium text-text-tertiary">Welcome back</p>
        <p className="truncate text-2xl font-semibold text-text-primary">{displayName}</p>
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
          onClick={toggleTheme}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-secondary transition-colors hover:bg-background-subtle hover:text-text-primary [&>svg]:h-7 [&>svg]:w-7"
          aria-label={theme === "dark" ? "Use light theme" : "Use dark theme"}
        >
          {theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
        </button>
        <span
          className="ml-2 flex h-12 w-12 items-center justify-center rounded-full bg-action-primary-subtle text-action-primary [&>svg]:h-7 [&>svg]:w-7"
          aria-label="User profile"
          role="img"
        >
          <Icons.User />
        </span>
      </div>
    </header>
  );
}
