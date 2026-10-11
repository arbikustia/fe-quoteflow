import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ConfirmModal from "./ConfirmModal.container";

describe("ConfirmModal", (): void => {
  it("should preserve dialog while async confirmation is pending", async (): Promise<void> => {
    let resolveConfirmation: (() => void) | undefined;
    const onConfirm = vi.fn(() => new Promise<void>((resolve): void => { resolveConfirmation = resolve; }));
    const onClose = vi.fn();
    render(<ConfirmModal consequence="This cannot be undone." confirmText="Delete customer" isOpen={true} onClose={onClose} onConfirm={onConfirm} recordName="Customer ACME" title="Delete customer" />);

    fireEvent.click(screen.getByRole("button", { name: "Delete customer" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete customer" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Delete customer" })).toBeDisabled();
    expect(onClose).not.toHaveBeenCalled();
    resolveConfirmation?.();
    await waitFor((): void => expect(onClose).toHaveBeenCalledOnce());
  });

  it("should keep dialog open and expose recovery when async confirmation rejects", async (): Promise<void> => {
    const onClose = vi.fn();
    const onConfirmError = vi.fn();
    const onConfirm = vi.fn(() => Promise.reject(new Error("Delete failed.")));
    render(<ConfirmModal confirmText="Delete customer" isOpen={true} onClose={onClose} onConfirm={onConfirm} onConfirmError={onConfirmError} title="Delete customer" />);

    fireEvent.click(screen.getByRole("button", { name: "Delete customer" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Delete failed.");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
    expect(onConfirmError).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should keep dialog open and expose recovery when confirmation throws", (): void => {
    const onClose = vi.fn();
    const onConfirm = vi.fn((): void => { throw new Error("Delete failed."); });
    render(<ConfirmModal confirmText="Delete customer" isOpen={true} onClose={onClose} onConfirm={onConfirm} title="Delete customer" />);

    fireEvent.click(screen.getByRole("button", { name: "Delete customer" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Delete failed.");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should block every dialog action when disabled", (): void => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(<ConfirmModal disabled={true} isOpen={true} onClose={onClose} onConfirm={onConfirm} title="Delete customer" />);

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    fireEvent.click(screen.getByTestId("modal-backdrop"));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should close after synchronous confirmation and use non-danger action", (): void => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(<ConfirmModal confirmText="Approve quotation" isDestructive={false} isOpen={true} message="Approve this quotation?" onClose={onClose} onConfirm={onConfirm} title="Approve quotation" />);

    fireEvent.click(screen.getByRole("button", { name: "Approve quotation" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
