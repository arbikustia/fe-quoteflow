import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@/libs/unit-test";

import { InvoiceStatusForm } from "./InvoiceStatus.component";
import type { InvoiceStatusFormProps } from "./InvoiceStatus.type";

const createProps = (overrides?: Partial<InvoiceStatusFormProps>): InvoiceStatusFormProps => ({
  invoiceNumber: "INV-001",
  isActive: true,
  isLoading: false,
  isSubmitting: false,
  errorMessage: null,
  handleStatusChange: jest.fn(),
  handleSubmit: async (): Promise<void> => undefined,
  goBack: jest.fn(),
  ...overrides,
});

describe("InvoiceStatusForm", () => {
  it("should render status-only form", (): void => {
    render(<InvoiceStatusForm {...createProps()} />);

    expect(screen.getByText("INV-001")).toBeTruthy();
    expect(screen.getByRole("switch", { name: "Invoice status" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("button", { name: "Update Status" })).toBeTruthy();
  });

  it("should change status without submitting automatically", (): void => {
    const handleStatusChange = jest.fn();
    const handleSubmit = jest.fn(async (): Promise<void> => undefined);

    render(<InvoiceStatusForm {...createProps({ handleStatusChange, handleSubmit })} />);
    fireEvent.click(screen.getByRole("switch", { name: "Invoice status" }));

    expect(handleStatusChange).toHaveBeenCalledWith(false, expect.anything());
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
