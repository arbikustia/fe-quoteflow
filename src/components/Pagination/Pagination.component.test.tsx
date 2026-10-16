import { fireEvent, render, screen } from "@testing-library/react";

import { Pagination } from "./Pagination.component";

describe("Pagination Component", () => {
  it("should render page size dropdown, pages, and navigation buttons", (): void => {
    const onPageChange = jest.fn();
    const onPageSizeChange = jest.fn();

    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        pageSize={10}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );

    expect(screen.getByRole("option", { name: "10" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();

    const prevButton = screen.getByRole("button", { name: /Previous/i });
    const nextButton = screen.getByRole("button", { name: /Next/i });

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(nextButton);
    expect(onPageChange).toHaveBeenCalledWith(2);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "20" } });
    expect(onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it("should handle page click and disabled next button on last page", (): void => {
    const onPageChange = jest.fn();
    const onPageSizeChange = jest.fn();

    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        pageSize={10}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );

    const prevButton = screen.getByRole("button", { name: /Previous/i });
    const nextButton = screen.getByRole("button", { name: /Next/i });

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).toBeDisabled();

    fireEvent.click(prevButton);
    expect(onPageChange).toHaveBeenCalledWith(4);

    fireEvent.click(screen.getByRole("button", { name: "3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
