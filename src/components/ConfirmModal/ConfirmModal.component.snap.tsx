import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ConfirmModal from "./ConfirmModal.container";

describe("ConfirmModal snapshot", (): void => {
  it("should render destructive confirmation details", (): void => {
    const { asFragment } = render(<ConfirmModal consequence="This cannot be undone." confirmText="Delete customer" isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} recordName="Customer ACME" title="Delete customer" />);

    expect(asFragment()).toMatchSnapshot();
  });
});
