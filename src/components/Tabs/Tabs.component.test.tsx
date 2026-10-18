import { fireEvent, render, screen } from "@testing-library/react";

import { Tabs } from "./Tabs.component";

describe("Tabs", () => {
  const items = [
    { id: "all", label: "All", count: 3 },
    { id: "active", label: "Active" },
  ];

  it("should render tabs and active state", (): void => {
    render(<Tabs items={items} activeId="all" onChange={jest.fn()} />);

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "All 3" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Active" })).toHaveAttribute("aria-selected", "false");
  });

  it("should call onChange with selected tab id", (): void => {
    const onChange = jest.fn();
    render(<Tabs items={items} activeId="all" onChange={onChange} />);

    fireEvent.click(screen.getByRole("tab", { name: "Active" }));

    expect(onChange).toHaveBeenCalledWith("active");
  });

  it("should render optional icon and count", (): void => {
    render(<Tabs items={[{ id: "all", label: "All", count: 5, icon: <span data-testid="tab-icon">Icon</span> }]} activeId="all" onChange={jest.fn()} />);

    expect(screen.getByTestId("tab-icon")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
