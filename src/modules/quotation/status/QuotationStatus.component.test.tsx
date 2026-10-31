import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@/libs/unit-test";

import { QuotationStatusForm } from "./QuotationStatus.component";
import type { QuotationStatusFormProps } from "./QuotationStatus.type";

const createProps = (overrides?: Partial<QuotationStatusFormProps>): QuotationStatusFormProps => ({
  quotationNumber: "QUO-001",
  isApproved: true,
  isLoading: false,
  isSubmitting: false,
  errorMessage: null,
  handleStatusChange: jest.fn(),
  handleSubmit: async (): Promise<void> => undefined,
  goBack: jest.fn(),
  ...overrides,
});

describe("QuotationStatusForm", () => {
  it("should render status-only form", (): void => {
    render(<QuotationStatusForm {...createProps()} />);

    expect(screen.getByText("QUO-001")).toBeTruthy();
    expect(screen.getByRole("switch", { name: "Approve this quotation" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("button", { name: "Approve Quotation" })).toBeTruthy();
  });

  it("should change status without submitting automatically", (): void => {
    const handleStatusChange = jest.fn();
    const handleSubmit = jest.fn(async (): Promise<void> => undefined);

    render(<QuotationStatusForm {...createProps({ handleStatusChange, handleSubmit })} />);
    fireEvent.click(screen.getByRole("switch", { name: "Approve this quotation" }));

    expect(handleStatusChange).toHaveBeenCalledWith(false, expect.anything());
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
