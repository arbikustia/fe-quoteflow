import { fireEvent, render, screen } from "@/libs/unit-test";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import type { SidebarProps } from "./Sidebar.type";
import { SidebarComponent } from "./Sidebar.component";
import { NAVIGATION_CONFIG } from "./Sidebar.config";

describe("SidebarComponent Test", () => {
  const defaultProps: SidebarProps = {
    navigation: NAVIGATION_CONFIG,
    currentPath: "/home",
    openMenus: [] as string[],
    onToggleMenu: jest.fn(),
    isCollapsed: false,
    isProfileOpen: false,
    onToggleProfile: jest.fn(),
    theme: "light",
    onToggleTheme: jest.fn(),
    onLogout: jest.fn(),
  };

  it("should render SidebarComponent with Master Data", () => {
    render(React.createElement(MemoryRouter, null, React.createElement(SidebarComponent, defaultProps)));

    expect(screen.getByText("Master Data")).toBeDefined();
  });

  it("should render Document sub-menus", () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(SidebarComponent, { ...defaultProps, openMenus: ["Document"] }),
      ),
    );

    expect(screen.getByRole("link", { name: "Quotation" })).toHaveAttribute("href", "/document/quotation");
    expect(screen.getByRole("link", { name: "Invoice" })).toHaveAttribute("href", "/document/invoice");
    expect(screen.getByRole("link", { name: "Item Checklist" })).toHaveAttribute("href", "/document/item-checklist");
    expect(screen.getByRole("link", { name: "Payment" })).toHaveAttribute("href", "/document/payment");
  });

  it("should call onToggleTheme when theme switch is clicked", () => {
    const onToggleTheme = jest.fn();

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(SidebarComponent, { ...defaultProps, onToggleTheme }),
      ),
    );

    fireEvent.click(screen.getByRole("switch", { name: /Toggle dark theme/i }));

    expect(onToggleTheme).toHaveBeenCalled();
  });

  it("should render theme switch in collapsed sidebar", () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(SidebarComponent, { ...defaultProps, isCollapsed: true }),
      ),
    );

    expect(screen.getByRole("switch", { name: /Toggle dark theme/i })).toBeDefined();
  });
});
