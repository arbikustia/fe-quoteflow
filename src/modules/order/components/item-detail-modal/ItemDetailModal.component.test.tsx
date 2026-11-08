import { describe, expect, it, jest } from "@jest/globals";

import { fireEvent, render, screen } from "@/libs/unit-test";

import { ItemDetailModal } from "./ItemDetailModal.component";

const quote = {
  id: "order-1",
  name: "Annual Meeting",
  category: "Audio",
  selectedItems: ["Speaker", "Microphone"],
};

describe("ItemDetailModal", (): void => {
  it("should stay hidden when closed or missing a quote", (): void => {
    const { rerender } = render(<ItemDetailModal isOpen={false} onClose={jest.fn()} quote={quote as never} />);

    expect(screen.queryByText("Selected Items")).toBeNull();

    rerender(<ItemDetailModal isOpen onClose={jest.fn()} quote={null} />);
    expect(screen.queryByText("Selected Items")).toBeNull();
  });

  it("should render selected items and close from the footer", (): void => {
    const onClose = jest.fn();
    render(<ItemDetailModal isOpen onClose={onClose} quote={quote as never} />);

    expect(screen.getByText("Annual Meeting")).not.toBeNull();
    expect(screen.getByText("Speaker")).not.toBeNull();
    expect(screen.getByText("Microphone")).not.toBeNull();
    expect(screen.getAllByText("1 unit")).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should show an empty state when no items are selected", (): void => {
    render(<ItemDetailModal isOpen onClose={jest.fn()} quote={{ ...quote, selectedItems: [] } as never} />);

    expect(screen.getByText("No items selected.")).not.toBeNull();
  });
});
