import { render, screen } from "@/libs/unit-test";
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
    onLogout: jest.fn(),
  };

  it("should render SidebarComponent with Master Data", () => {
    render(React.createElement(MemoryRouter, null, React.createElement(SidebarComponent, defaultProps)));

    expect(screen.getByText("Master Data")).toBeDefined();
  });

  it("should render primary navigation links", () => {
    render(React.createElement(MemoryRouter, null, React.createElement(SidebarComponent, defaultProps)));

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/home");
    expect(screen.getByRole("link", { name: "Create Order" })).toHaveAttribute("href", "/order/create");
  });


  it("should render Document sub-menus", () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(SidebarComponent, { ...defaultProps, openMenus: ["Document", "Report"] }),
      ),
    );

    expect(screen.queryByRole("link", { name: "Draft Order" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Quotation" })).toHaveAttribute("href", "/document/quotation");
    expect(screen.getByRole("link", { name: "Invoice" })).toHaveAttribute("href", "/document/invoice");
    expect(screen.getByRole("link", { name: "Item Checklist" })).toHaveAttribute("href", "/item-checklist");
    expect(screen.getByRole("link", { name: "Payment" })).toHaveAttribute("href", "/document/payment");
    expect(screen.getByRole("link", { name: "Calendar" })).toHaveAttribute("href", "/calendar");
    expect(screen.getByRole("link", { name: "Order" })).toHaveAttribute("href", "/report");
  });
});
