import * as React from "react";

import { getUsername, isNavigationSectionArray } from "./Sidebar.helpers";
import { renderSidebar } from "./Sidebar.helpers.tsx";
import type { NavigationSection, SidebarProps } from "./Sidebar.type";

/**
 * Reusable sidebar — supports expanded/collapsed, badges, children, tooltips, profile dropdown.
 * Sections derived from flat navigation when no sections passed.
 * @param {SidebarProps} props - props
 * @returns {React.ReactElement} node
 */
export const SidebarComponent = (props: SidebarProps): React.ReactElement => {
  const displayName = getUsername() || "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const sections: readonly NavigationSection[] = isNavigationSectionArray(props.navigation)
    ? props.navigation
    : [{ title: "Menu", items: props.navigation }];

  return renderSidebar({ ...props, displayName, initials, sections });
};
