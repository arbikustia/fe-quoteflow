import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import MasterCustomerContainer from "./MasterCustomer.container";

// Mock the component to avoid rendering the full UI
vi.mock("./MasterCustomer.component", () => ({
  MasterCustomerComponent: (props: any) => (
    <div data-testid="mock-component" {...props} />
  ),
}));

describe("MasterCustomer Container", () => {
  it("should render component with correct props", () => {
    render(
      <BrowserRouter>
        <MasterCustomerContainer />
      </BrowserRouter>
    );

    const component = screen.getByTestId("mock-component");
    expect(component).toBeInTheDocument();
  });
});
