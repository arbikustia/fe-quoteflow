import { describe, expect, it, jest } from "@jest/globals";

import { fireEvent, render, screen } from "@/libs/unit-test";

import { CategoryDetailModal } from "./CategoryDetailModal.component";

const quote = {
  id: "order-1",
  name: "Annual Meeting",
  category: "Audio, Lighting",
  selectedItems: [],
};

describe("CategoryDetailModal", (): void => {
  it("should stay hidden when closed or missing a quote", (): void => {
    const { rerender } = render(<CategoryDetailModal isOpen={false} onClose={jest.fn()} quote={quote as never} />);

    expect(screen.queryByText("Selected Categories")).toBeNull();

    rerender(<CategoryDetailModal isOpen onClose={jest.fn()} quote={null} />);
    expect(screen.queryByText("Selected Categories")).toBeNull();
  });

  it("should render trimmed categories and close from the footer", (): void => {
    const onClose = jest.fn();
    render(<CategoryDetailModal isOpen onClose={onClose} quote={quote as never} />);

    expect(screen.getByText("Annual Meeting")).not.toBeNull();
    expect(screen.getByText("Audio")).not.toBeNull();
    expect(screen.getByText("Lighting")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should show an empty state when no categories are selected", (): void => {
    render(<CategoryDetailModal isOpen onClose={jest.fn()} quote={{ ...quote, category: " , " } as never} />);

    expect(screen.getByText("No categories selected.")).not.toBeNull();
  });
});
