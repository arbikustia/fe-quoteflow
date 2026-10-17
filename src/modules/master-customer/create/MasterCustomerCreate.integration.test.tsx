import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import MasterCustomerCreateContainer from "./MasterCustomerCreate.container";
import { useCreateCustomerMutation, useGetCustomerByIdQuery, useUpdateCustomerMutation } from "@/services/master-customer.service";

const mocks = {
  mutateCreate: jest.fn(),
  mutateUpdate: jest.fn(),
  navigate: jest.fn(),
};

let mockParams: { id?: string } = {};

jest.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }: { readonly children: ReactNode }) => children,
  useNavigate: () => mocks.navigate,
  useLocation: () => ({ state: null }),
  useParams: () => mockParams,
}));

jest.mock("@/services/master-customer.service", () => ({
  useCreateCustomerMutation: jest.fn(),
  useUpdateCustomerMutation: jest.fn(),
  useGetCustomerByIdQuery: jest.fn(),
}));

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { readonly children: ReactNode }) => children,
}));

/**
 * Render create container for tests
 * @returns {void}
 */
const renderCreatePage = (): void => {
  render(<MasterCustomerCreateContainer />);
};

/**
 * Fill form inputs
 * @returns {void}
 */
const fillCreateForm = (): void => {
  fireEvent.change(screen.getByPlaceholderText("e.g. PT Mega Jaya Abadi"), { target: { value: "Test Customer" } });
  fireEvent.change(screen.getByPlaceholderText("0812... atau 628..."), { target: { value: "081234567890" } });
  fireEvent.change(screen.getByPlaceholderText("e.g. Jl. Sudirman No. 45"), { target: { value: "Test Address" } });
};

describe("MasterCustomerCreate integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    jest.mocked(useCreateCustomerMutation).mockReturnValue([
      mocks.mutateCreate,
      { isLoading: false },
    ] as never);
    jest.mocked(useUpdateCustomerMutation).mockReturnValue([
      mocks.mutateUpdate,
      { isLoading: false },
    ] as never);
    jest.mocked(useGetCustomerByIdQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as never);
  });

  it("should show success message and navigate on successful create", async () => {
    mocks.mutateCreate.mockReturnValue({
      unwrap: () => Promise.resolve({ status: true, messages: null, data: null }),
    });

    renderCreatePage();
    fillCreateForm();
    fireEvent.click(screen.getByText("Create Customer"));

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith("/master-customer"));
  });

  it("should show error message when envelope status is false", async () => {
    mocks.mutateCreate.mockReturnValue({
      unwrap: () => Promise.resolve({ status: false, messages: ["Duplicate customer name"], data: null }),
    });

    renderCreatePage();
    fillCreateForm();
    fireEvent.click(screen.getByText("Create Customer"));

    await waitFor(() => expect(screen.getByText("Duplicate customer name")).toBeTruthy());
  });

  it("should show generic error on transport failure", async () => {
    mocks.mutateCreate.mockReturnValue({
      unwrap: () => Promise.reject(new Error("Network error")),
    });

    renderCreatePage();
    fillCreateForm();
    fireEvent.click(screen.getByText("Create Customer"));

    await waitFor(() => expect(screen.getByText("Unable to create customer. Please try again.")).toBeTruthy());
  });

  it("should populate default values and call updateCustomer in edit mode", async () => {
    mockParams = { id: "3fa85f64-5717-4562-b3fc-2c963f66afa6" };
    jest.mocked(useGetCustomerByIdQuery).mockReturnValue({
      data: {
        status: true,
        messages: null,
        data: {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          name: "Existing PT Customer",
          address: "Existing Address Jl. Sudirman",
          phone_number: "081999888777",
          status: 1,
          created_at: "2026-01-01",
          created_by: "Admin",
        },
      },
      isLoading: false,
    } as never);

    mocks.mutateUpdate.mockReturnValue({
      unwrap: () => Promise.resolve({ status: true, messages: null, data: null }),
    });

    renderCreatePage();

    expect(screen.getByDisplayValue("Existing PT Customer")).toBeTruthy();
    expect(screen.getByDisplayValue("Existing Address Jl. Sudirman")).toBeTruthy();
    expect(screen.getByDisplayValue("081999888777")).toBeTruthy();

    fireEvent.click(screen.getByText("Update Customer"));

    await waitFor(() => {
      expect(mocks.mutateUpdate).toHaveBeenCalledWith({
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        name: "Existing PT Customer",
        address: "Existing Address Jl. Sudirman",
        phone_number: "081999888777",
        status: 1,
      });
      expect(mocks.navigate).toHaveBeenCalledWith("/master-customer");
    });
  });
});
