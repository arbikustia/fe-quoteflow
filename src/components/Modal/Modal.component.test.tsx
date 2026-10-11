import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Modal from "./Modal.container";

describe("Modal", () => {
  it("should expose dialog relationship and restore trigger focus", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();
    const onClose = vi.fn();
    const { unmount } = render(<Modal isOpen={true} onClose={onClose} title="Edit customer"><button type="button">Save</button></Modal>);

    const dialog = screen.getByRole("dialog", { name: "Edit customer" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("button", { name: "Close dialog" })).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
    unmount();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it("should ignore escape and backdrop while close disabled", () => {
    const onClose = vi.fn();
    render(<Modal isCloseDisabled={true} isOpen={true} onClose={onClose} title="Saving"><p>Wait</p></Modal>);

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(onClose).not.toHaveBeenCalled();
  });
});
