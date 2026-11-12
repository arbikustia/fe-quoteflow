import { MemoryRouter } from "react-router-dom";

import { MOCK_CUSTOMER_LIST_RESPONSE } from "@/fixture/master-customer";
import { render, screen } from "@/libs/unit-test";
import { useGetCustomersQuery } from "@/services/master-customer.service";

import MasterCustomerContainer from "./MasterCustomer.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-customer.service", () => ({ useGetCustomersQuery: jest.fn() }));

describe("MasterCustomerContainer", () => {
  beforeEach(() => {
    jest.mocked(useGetCustomersQuery).mockReturnValue({ data: MOCK_CUSTOMER_LIST_RESPONSE, isLoading: false, isError: false } as never);
  });

  it("should query the first page and render normalized customers", () => {
    render(
      <MemoryRouter>
        <MasterCustomerContainer />
      </MemoryRouter>,
    );

    expect(useGetCustomersQuery).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 10, searchTerm: "" });
    expect(screen.getAllByText("CV Sinar Terang")).toHaveLength(2);
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  it("should show the success message from router state", () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/master-customer", state: { successMessage: "Customer updated successfully." } }]}>
        <MasterCustomerContainer />
      </MemoryRouter>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Customer updated successfully.");
  });

  it("should render the error message when the query fails", () => {
    jest.mocked(useGetCustomersQuery).mockReturnValue({ data: undefined, isLoading: false, isError: true } as never);

    render(
      <MemoryRouter>
        <MasterCustomerContainer />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("Unable to load customers.")).toHaveLength(2);
  });
});
