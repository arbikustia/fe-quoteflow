import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import SidebarContainer from "./Sidebar.container";

vi.mock("./Sidebar.hook", () => ({
  useSidebarState: (): unknown => ({
    currentPath: "/home",
    openMenus: [],
    onToggleMenu: vi.fn(),
    isCollapsed: false,
    onToggleCollapsed: vi.fn(),
    isProfileOpen: false,
    onToggleProfile: vi.fn(),
  }),
}));

describe("SidebarContainer Test", () => {
  it("should render SidebarContainer", () => {
    const { container } = render(
      React.createElement(MemoryRouter, null, React.createElement(SidebarContainer)),
    );

    expect(container).toBeDefined();
  });
});
