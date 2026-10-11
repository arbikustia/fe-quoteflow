import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Modal from "./Modal.container";

describe("Modal", (): void => {
  it("should expose accessible title relationship and restore trigger focus", (): void => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();
    const onClose = vi.fn();
    const { unmount } = render(<Modal isOpen={true} onClose={onClose} title="Edit customer"><button type="button">Save</button></Modal>);

    const dialog = screen.getByRole("dialog", { name: "Edit customer" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("button", { name: "Close dialog" })).toBeInTheDocument();
    unmount();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it("should focus first interactive element when opened", (): void => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Edit customer"><button type="button">Save</button></Modal>);

    expect(screen.getByRole("button", { name: "Close dialog" })).toHaveFocus();
  });

  it("should trap focus in both tab directions", (): void => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Edit customer"><button type="button">Save</button></Modal>);

    const dialog = screen.getByRole("dialog");
    const closeButton = screen.getByRole("button", { name: "Close dialog" });
    const saveButton = screen.getByRole("button", { name: "Save" });
    closeButton.focus();
    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(saveButton).toHaveFocus();
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(closeButton).toHaveFocus();
  });

  it("should close by escape and backdrop when enabled", (): void => {
    const onClose = vi.fn();
    render(<Modal isOpen={true} onClose={onClose} title="Edit customer"><button type="button">Save</button></Modal>);

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    fireEvent.click(screen.getByTestId("modal-backdrop"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("should ignore disabled close, escape, and backdrop", (): void => {
    const onClose = vi.fn();
    render(<Modal isCloseDisabled={true} isOpen={true} onClose={onClose} title="Saving"><p>Wait</p></Modal>);

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    fireEvent.click(screen.getByTestId("modal-backdrop"));
    fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should ignore escape and backdrop by policy", (): void => {
    const onClose = vi.fn();
    render(<Modal closeOnBackdrop={false} closeOnEscape={false} isOpen={true} onClose={onClose} title="Edit customer"><button type="button">Save</button></Modal>);

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    fireEvent.click(screen.getByTestId("modal-backdrop"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
