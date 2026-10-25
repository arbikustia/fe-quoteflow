import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@/libs/unit-test";

import { MasterPicCreateForm } from "./MasterPicCreate.component";
import type { MasterPicCreateState } from "./MasterPicCreate.type";

const PROPS: MasterPicCreateState = {
  name: "",
  isActive: true,
  isEditMode: false,
  isLoadingInitialData: false,
  isSubmitting: false,
  errorMessage: null,
  errors: { name: { type: "required", message: "PIC name is required." } },
  isSubmitted: true,
  handleNameChange: jest.fn(),
  handleStatusChange: jest.fn(),
  handleSubmit: jest.fn(async (): Promise<void> => Promise.resolve()),
  goBack: jest.fn(),
};

describe("MasterPicCreateForm validation", () => {
  it("renders required marker, inline error, and noValidate form", () => {
    render(<MasterPicCreateForm {...PROPS} />);

    const input = screen.getByLabelText(/PIC Name/i);

    expect(input.hasAttribute("required")).toBe(true);
    expect(screen.getByText("PIC name is required.")).toBeTruthy();
    expect(input.closest("form")?.hasAttribute("novalidate")).toBe(true);
  });
});
