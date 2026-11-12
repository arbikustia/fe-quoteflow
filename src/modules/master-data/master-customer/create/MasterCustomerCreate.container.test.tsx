import { MemoryRouter, Route, Routes } from "react-router-dom";

import { fireEvent, render, screen, waitFor } from "@/libs/unit-test";
import { useCreateCustomerMutation, useGetCustomerByIdQuery, useUpdateCustomerMutation } from "@/services/master-customer.service";

import MasterCustomerCreateContainer from "./MasterCustomerCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-customer.service", () => ({
  useGetCustomerByIdQuery: jest.fn(),
  useCreateCustomerMutation: jest.fn(),
  useUpdateCustomerMutation: jest.fn(),
}));

const updateCustomer = jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

/**
 * Render the container on the given route.
 * @param {string} path - Initial route
 * @returns {void}
 */
const renderAt = (path: string): void => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/master-customer" element={<p>Customer list</p>} />
        <Route path="/master-customer/create" element={<MasterCustomerCreateContainer />} />
        <Route path="/master-customer/edit/:id" element={<MasterCustomerCreateContainer />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("MasterCustomerCreateContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useGetCustomerByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as never);
    jest.mocked(useCreateCustomerMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateCustomerMutation).mockReturnValue([updateCustomer, { isLoading: false }] as never);
  });

  it("should render an empty create form and skip the detail query", () => {
    renderAt("/master-customer/create");

    expect(useGetCustomerByIdQuery).toHaveBeenCalledWith("", { skip: true });
    expect(screen.getByRole("button", { name: "Create Customer" })).toBeInTheDocument();
  });

  it("should load the customer by id and submit the update", async () => {
    jest.mocked(useGetCustomerByIdQuery).mockReturnValue({
      data: { status: true, data: { id: "c-1", name: "Existing", email: "e@x.com", address: "Addr", phone_number: "081999888777", status: 1 } },
      isLoading: false,
      isError: false,
    } as never);

    renderAt("/master-customer/edit/c-1");

    await waitFor(() => expect(screen.getByDisplayValue("Existing")).toBeInTheDocument());
    fireEvent.submit(screen.getByRole("button", { name: "Update Customer" }));

    await waitFor(() => expect(screen.getByText("Customer list")).toBeInTheDocument());
    expect(useGetCustomerByIdQuery).toHaveBeenCalledWith("c-1", { skip: false });
    expect(updateCustomer).toHaveBeenCalledWith({ id: "c-1", name: "Existing", email: "e@x.com", address: "Addr", phone_number: "081999888777", status: 1 });
  });

  it("should show the load error when the customer cannot be fetched", () => {
    jest.mocked(useGetCustomerByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: true } as never);

    renderAt("/master-customer/edit/c-1");

    expect(screen.getByText("Unable to load customer data. Please try again.")).toBeInTheDocument();
  });
});
