import { fireEvent, render, screen } from "@testing-library/react";

import { SearchFilter } from "./SearchFilter.component";

describe("SearchFilter", () => {
  it("should render search input with placeholder", (): void => {
    render(<SearchFilter placeholder="Search customer" />);

    expect(screen.getByLabelText("Search customer")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search customer")).toBeInTheDocument();
  });

  it("should call onChange when user types", (): void => {
    const onChange = jest.fn();
    render(<SearchFilter placeholder="Search" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Search"), { target: { value: "test" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("should apply custom className", (): void => {
    const { container } = render(<SearchFilter placeholder="Search" className="max-w-xs" />);

    expect(container.querySelector("label")?.className).toContain("max-w-xs");
  });
});
