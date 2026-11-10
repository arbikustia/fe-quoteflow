import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { usePagePermission } from "@/hooks/usePagePermission";

import MobileNavigateContainer from "./MobileNavigate.container";
import { _isTabActive } from "./MobileNavigate.hook";
import test from "../../libs/unit-test";

jest.mock("@/hooks/usePagePermission", () => ({
  usePagePermission: jest.fn(() => ({ canView: true })),
}));

beforeEach(() => {
  jest.mocked(usePagePermission).mockImplementation(() => ({
    canView: true,
    canCreate: false,
    canEdit: false,
    isSuperadmin: false,
  }));
});


describe("MobileNavigateContainer Test", () => {
  it("should match exact master data route", () => {
    expect(_isTabActive("/master-main", "/master-main")).toBe(true);
    expect(_isTabActive("/master-main", "/master-customer")).toBe(false);
  });

  it("should hide navigation for master sub-routes", () => {
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/master-customer"] },
        React.createElement(MobileNavigateContainer),
      ),
    );

    expect(screen.queryByRole("navigation", { name: "Main mobile navigation" })).toBeNull();
  });

  it("should show mobile navigation outside master detail routes", () => {
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/home"] },
        React.createElement(MobileNavigateContainer),
      ),
    );

    expect(screen.getByRole("button", { name: "Home" })).toBeDefined();
  });

  it("should remove navigation items when view permission is denied", () => {
    jest.mocked(usePagePermission).mockImplementation((url: string) => ({
      canView: url !== "/calendar",
      canCreate: false,
      canEdit: false,
      isSuperadmin: false,
    }));

    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/home"] },
        React.createElement(MobileNavigateContainer),
      ),
    );

    expect(screen.queryByRole("button", { name: "Calendar" })).toBeNull();
    expect(screen.getByRole("button", { name: "Home" })).toBeDefined();
  });

  const snapshotConfigs = [
    {
      props: { initialEntries: ["/home"] },
      desc: "Should Render MobileNavigateContainer outside master route",
    },
    {
      props: { initialEntries: ["/master-main"] },
      desc: "Should Render MobileNavigateContainer with active master data",
    },
    {
      props: { initialEntries: ["/master-customer"] },
      desc: "Should Render MobileNavigateContainer hidden for master sub-route",
    },
  ];

  it("MobileNavigateContainer matches snapshot", () => {
    test.assertSnapshots(MobileNavigateContainer, snapshotConfigs);
  });
});
