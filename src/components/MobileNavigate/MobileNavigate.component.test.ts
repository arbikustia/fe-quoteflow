import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { MobileNavigateComponent } from "./MobileNavigate.component";
import type { MobileNavigateProps } from "./MobileNavigate.type";
import { Icons } from "../Icons";
import test from "../../libs/unit-test";

const DEFAULT_PROPS: MobileNavigateProps = {
  items: [
    { id: "/home", label: "Home", Icon: Icons.Dashboard, isActive: true },
    { id: "/order", label: "Order", Icon: Icons.Document, isActive: false },
    { id: "/return", label: "Return", Icon: Icons.Schedule, isActive: false },
    { id: "/master-main", label: "Master", Icon: Icons.Database, isActive: false },
    { id: "/report/main", label: "Report", Icon: Icons.Reporting, isActive: false },
  ],
  onNavigate: jest.fn(),
  isHidden: false,
};

const snapshotConfigs: { props: MobileNavigateProps; desc: string }[] = [
  { props: DEFAULT_PROPS, desc: "Should Render MobileNavigateComponent with active home" },
  { props: { ...DEFAULT_PROPS, isHidden: true }, desc: "Should Render MobileNavigateComponent hidden" },
];

describe("MobileNavigateComponent Test", () => {
  it("should render all navigation items with active home", () => {
    render(React.createElement(MobileNavigateComponent, DEFAULT_PROPS));

    expect(screen.getByRole("navigation", { name: "Main mobile navigation" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Home" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("button", { name: "Master" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Report" })).toBeDefined();
  });

  it("should navigate to selected route", () => {
    const onNavigate = jest.fn();

    render(React.createElement(MobileNavigateComponent, { ...DEFAULT_PROPS, onNavigate }));
    fireEvent.click(screen.getByRole("button", { name: "Order" }));

    expect(onNavigate).toHaveBeenCalledWith("/order");
  });

  it("should hide navigation when requested", () => {
    const { container } = render(
      React.createElement(MobileNavigateComponent, { ...DEFAULT_PROPS, isHidden: true }),
    );

    expect(container.firstChild).toBeNull();
  });

  it("MobileNavigateComponent matches snapshot", () => {
    test.assertSnapshots(MobileNavigateComponent, snapshotConfigs);
  });
});
