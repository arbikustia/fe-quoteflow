import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { MobileNavigateComponent } from "./MobileNavigate.component";
import type { MobileNavigateProps } from "./MobileNavigate.type";
import { Icons } from "../Icons";
import test from "../../libs/unit-test";

const DEFAULT_PROPS: MobileNavigateProps = {
  items: [
    {
      id: "/home",
      label: "Home",
      Icon: Icons.Dashboard,
      isActive: true,
    },
    {
      id: "/order",
      label: "Order",
      Icon: Icons.Document,
      isActive: false,
    },
  ],
  onNavigate: vi.fn(),
  isHidden: false,
};

const mockOnNavigate = vi.fn();

const snapshotConfigs: { props: MobileNavigateProps; desc: string }[] = [
  {
    props: {
      items: [
        {
          id: "/home",
          label: "Home",
          Icon: Icons.Dashboard,
          isActive: true,
        },
        {
          id: "/order",
          label: "Order",
          Icon: Icons.Document,
          isActive: false,
        },
      ],
      onNavigate: mockOnNavigate,
      isHidden: false,
    },
    desc: "Should Render MobileNavigateComponent with active home",
  },
  {
    props: {
      items: [
        {
          id: "/home",
          label: "Home",
          Icon: Icons.Dashboard,
          isActive: false,
        },
        {
          id: "/order",
          label: "Order",
          Icon: Icons.Document,
          isActive: true,
        },
      ],
      onNavigate: mockOnNavigate,
      isHidden: false,
    },
    desc: "Should Render MobileNavigateComponent with active order",
  },
  {
    props: {
      items: [
        {
          id: "/home",
          label: "Home",
          Icon: Icons.Dashboard,
          isActive: false,
        },
      ],
      onNavigate: mockOnNavigate,
      isHidden: true,
    },
    desc: "Should Render MobileNavigateComponent hidden",
  },
];

describe("MobileNavigateComponent Test", () => {
  it("should render navigation with active item", () => {
    render(React.createElement(MobileNavigateComponent, DEFAULT_PROPS));

    expect(screen.getByRole("navigation", { name: "Main mobile navigation" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Home" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("button", { name: "Order" }).getAttribute("aria-current")).toBeNull();
  });

  it("should call onNavigate with selected path", () => {
    const onNavigate = vi.fn();

    render(React.createElement(MobileNavigateComponent, { ...DEFAULT_PROPS, onNavigate }));
    fireEvent.click(screen.getByRole("button", { name: "Order" }));

    expect(onNavigate).toHaveBeenCalledWith("/order");
  });

  it("should hide navigation on master sub-route", () => {
    const { container } = render(
      React.createElement(MobileNavigateComponent, { ...DEFAULT_PROPS, isHidden: true }),
    );

    expect(container.firstChild).toBeNull();
  });

  it("MobileNavigateComponent matches snapshot", () => {
    test.assertSnapshots(MobileNavigateComponent, snapshotConfigs);
  });
});
