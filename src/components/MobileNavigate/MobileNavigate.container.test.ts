import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import MobileNavigateContainer from "./MobileNavigate.container";
import { _isTabActive } from "./MobileNavigate.hook";
import test from "../../libs/unit-test";

describe("MobileNavigateContainer Test", () => {
  it("should match exact and nested routes", () => {
    expect(_isTabActive("/home", "/home")).toBe(true);
    expect(_isTabActive("/order", "/order/create")).toBe(true);
    expect(_isTabActive("/home", "/order")).toBe(false);
  });

  it("should match report descendants and only master main", () => {
    expect(_isTabActive("/report/main", "/report/sales")).toBe(true);
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

  it("should show navigation for default route", () => {
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/home"] },
        React.createElement(MobileNavigateContainer),
      ),
    );

    expect(screen.getByRole("navigation", { name: "Main mobile navigation" })).toBeDefined();
  });

  it("should show navigation for master-main route", () => {
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/master-main"] },
        React.createElement(MobileNavigateContainer),
      ),
    );

    expect(screen.getByRole("navigation", { name: "Main mobile navigation" })).toBeDefined();
  });

  const snapshotConfigs = [
    {
      props: { initialEntries: ["/home"] },
      desc: "Should Render MobileNavigateContainer with default route",
    },
    {
      props: { initialEntries: ["/order"] },
      desc: "Should Render MobileNavigateContainer with active order route",
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
