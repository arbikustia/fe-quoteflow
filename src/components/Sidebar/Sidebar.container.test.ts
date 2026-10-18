import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import SidebarContainer from "./Sidebar.container";

jest.mock("./Sidebar.hook", () => ({
  useSidebarState: (): unknown => ({
    currentPath: "/home",
    openMenus: [],
    onToggleMenu: jest.fn(),
    isCollapsed: false,
    onToggleCollapsed: jest.fn(),
    isProfileOpen: false,
    onToggleProfile: jest.fn(),
  }),
  useLogoutState: () => ({
    isLogoutConfirmOpen: false,
    handleLogout: jest.fn(),
    closeLogoutConfirm: jest.fn(),
    confirmLogout: jest.fn(),
  }),
}));

jest.mock("../../store/theme.hook", () => ({
  useTheme: () => ({
    theme: "light" as const,
    toggleTheme: jest.fn(),
    setTheme: jest.fn(),
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
