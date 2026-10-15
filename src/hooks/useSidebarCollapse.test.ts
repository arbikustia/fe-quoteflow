import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { useSidebarCollapse } from "./useSidebarCollapse";

/**
 * Test component to render and test useSidebarCollapse hook.
 * @returns {React.ReactElement} test element
 */
const TestComponent = (): React.ReactElement => {
  const { isSidebarCollapsed, onToggleSidebarCollapsed } = useSidebarCollapse();

  return React.createElement(
    "div",
    null,
    React.createElement("span", { "data-testid": "collapsed" }, String(isSidebarCollapsed)),
    React.createElement("button", { type: "button", onClick: onToggleSidebarCollapsed }, "Toggle"),
  );
};

describe("useSidebarCollapse", () => {
  it("should toggle collapse state", () => {
    render(React.createElement(TestComponent));

    expect(screen.getByTestId("collapsed").textContent).toBe("false");

    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));

    expect(screen.getByTestId("collapsed").textContent).toBe("true");
  });
});
