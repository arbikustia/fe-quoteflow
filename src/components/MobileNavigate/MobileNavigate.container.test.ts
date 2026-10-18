import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import MobileNavigateContainer from "./MobileNavigate.container";
import { _isTabActive } from "./MobileNavigate.hook";
import test from "../../libs/unit-test";

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

  it("should show master data navigation outside master detail routes", () => {
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/home"] },
        React.createElement(MobileNavigateContainer),
      ),
    );

    expect(screen.getByRole("button", { name: "Master" })).toBeDefined();
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
