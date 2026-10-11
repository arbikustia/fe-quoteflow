import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ConfirmModal from "./ConfirmModal.container";

describe("ConfirmModal", () => {
  it("should preserve dialog while async confirmation is pending", async () => {
    let resolveConfirmation: (() => void) | undefined;
    const onConfirm = vi.fn(() => new Promise<void>((resolve) => { resolveConfirmation = resolve; }));
    const onClose = vi.fn();
    render(<ConfirmModal consequence="This cannot be undone." confirmText="Delete customer" isOpen={true} onClose={onClose} onConfirm={onConfirm} recordName="Customer ACME" title="Delete customer" />);

    fireEvent.click(screen.getByRole("button", { name: "Delete customer" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Delete customer" })).toBeDisabled();
    expect(onClose).not.toHaveBeenCalled();
    resolveConfirmation?.();
    await Promise.resolve();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("should close after synchronous confirmation and use non-danger action", () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    const { asFragment } = render(<ConfirmModal confirmText="Approve quotation" isDestructive={false} isOpen={true} message="Approve this quotation?" onClose={onClose} onConfirm={onConfirm} title="Approve quotation" />);

    fireEvent.click(screen.getByRole("button", { name: "Approve quotation" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
    expect(asFragment()).toMatchSnapshot();
  });
});
