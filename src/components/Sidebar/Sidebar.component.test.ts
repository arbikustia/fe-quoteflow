import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { SidebarComponent } from "./Sidebar.component";
import { NAVIGATION_CONFIG } from "./Sidebar.config";

describe("SidebarComponent Test", () => {
  const defaultProps = {
    navigation: NAVIGATION_CONFIG,
    currentPath: "/home",
    openMenus: [] as readonly string[],
    onToggleMenu: vi.fn(),
    isCollapsed: false,
    onToggleCollapsed: vi.fn(),
    isProfileOpen: false,
    onToggleProfile: vi.fn(),
  };

  it("should render SidebarComponent with Master Data", () => {
    render(React.createElement(MemoryRouter, null, React.createElement(SidebarComponent, defaultProps)));

    expect(screen.getByText("Master Data")).toBeDefined();
  });

  it("should call onToggleCollapsed when logo button is clicked", () => {
    const onToggleCollapsed = vi.fn();

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(SidebarComponent, { ...defaultProps, onToggleCollapsed }),
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: /Collapse sidebar/i }));

    expect(onToggleCollapsed).toHaveBeenCalled();
  });
});
