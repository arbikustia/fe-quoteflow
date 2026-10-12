import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MasterCustomerCreateContainer from "./MasterCustomerCreate.container";
import { useCreateCustomerMutation } from "@/modules/master-customer/MasterCustomer.api";

const mocks = vi.hoisted(() => ({
  mutate: vi.fn(),
  navigate: vi.fn(),
  useCreateCustomerMutation: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }: { readonly children: ReactNode }) => children,
  useNavigate: () => mocks.navigate,
}));

vi.mock("@/modules/master-customer/MasterCustomer.api", () => ({
  useCreateCustomerMutation: mocks.useCreateCustomerMutation,
}));

const renderCreatePage = (): void => {
  render(<MasterCustomerCreateContainer />);
};

const fillCreateForm = (): void => {
  fireEvent.change(screen.getByPlaceholderText("e.g. PT Mega Jaya Abadi"), { target: { value: "Test Customer" } });
  fireEvent.change(screen.getByPlaceholderText("0812..."), { target: { value: "081234567890" } });
  fireEvent.change(screen.getByPlaceholderText("e.g. Jl. Sudirman No. 45"), { target: { value: "Test Address" } });
};

describe("MasterCustomerCreate integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCreateCustomerMutation).mockReturnValue([
      mocks.mutate,
      { isLoading: false } as never,
    ]);
  });

  it("should show success message and navigate on successful create", async () => {
    mocks.mutate.mockReturnValue({
      unwrap: () => Promise.resolve({ status: true, messages: null, data: null }),
    });

    renderCreatePage();
    fillCreateForm();
    fireEvent.click(screen.getByText("Create Customer"));

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith("/master-customer"));
  });

  it("should show error message when envelope status is false", async () => {
    mocks.mutate.mockReturnValue({
      unwrap: () => Promise.resolve({ status: false, messages: ["Duplicate customer name"], data: null }),
    });

    renderCreatePage();
    fillCreateForm();
    fireEvent.click(screen.getByText("Create Customer"));

    await waitFor(() => expect(screen.getByText("Duplicate customer name")).toBeInTheDocument());
  });

  it("should show generic error on transport failure", async () => {
    mocks.mutate.mockReturnValue({
      unwrap: () => Promise.reject(new Error("Network error")),
    });

    renderCreatePage();
    fillCreateForm();
    fireEvent.click(screen.getByText("Create Customer"));

    await waitFor(() => expect(screen.getByText("Unable to create customer. Please try again.")).toBeInTheDocument());
  });
});
