import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import MasterCustomerContainer from "./MasterCustomer.container";
import { useGetCustomersQuery } from "./MasterCustomer.api";

vi.mock("./MasterCustomer.api", () => ({
  useGetCustomersQuery: vi.fn(),
  useCreateCustomerMutation: vi.fn(),
  _mapCustomer: (customer: { readonly id: string; readonly name: string; readonly address: string | null; readonly phone_number: string | null; readonly status: number; readonly created_at: string | null; readonly created_by: string | null }) => ({
    id: customer.id,
    name: customer.name,
    address: customer.address ?? "",
    phoneNumber: customer.phone_number ?? "",
    status: customer.status === 1 ? "active" : "inactive",
    createAt: customer.created_at ?? "",
    createBy: customer.created_by ?? "",
  }),
}));

vi.mock("./MasterCustomer.component", () => ({
  MasterCustomerComponent: ({ setSearchTerm }: { readonly setSearchTerm: (searchTerm: string) => void }) => (
    <>
      <input aria-label="Search customer" onChange={(event) => setSearchTerm(event.target.value)} />
      <div data-testid="mock-component" />
    </>
  ),
}));

const mockQueryResult = {
  data: {
    status: true,
    messages: null,
    data: {
      data: [
        {
          id: "1",
          name: "PT Mega Jaya Abadi",
          address: "Jl. Sudirman No. 45",
          phone_number: "081234567890",
          status: 1,
          created_at: "2024-01-15 10:30",
          created_by: "Admin",
        },
      ],
      page_number: 1,
      total_pages: 2,
      page_size: 10,
      total_count: 11,
      has_previous: false,
      has_next: true,
    },
  },
  error: undefined,
  isLoading: false,
};

describe("MasterCustomer Container", () => {
  it("should render component while query resolves from API", () => {
    vi.mocked(useGetCustomersQuery).mockReturnValue(mockQueryResult as ReturnType<typeof useGetCustomersQuery>);

    render(
      <BrowserRouter>
        <MasterCustomerContainer />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("mock-component")).toBeInTheDocument();
    expect(useGetCustomersQuery).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 10, searchTerm: "" });
  });

  it("should refetch with search term when search input changes", () => {
    vi.mocked(useGetCustomersQuery).mockReturnValue(mockQueryResult as ReturnType<typeof useGetCustomersQuery>);

    render(
      <BrowserRouter>
        <MasterCustomerContainer />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByLabelText("Search customer"), { target: { value: "mega" } });

    expect(useGetCustomersQuery).toHaveBeenLastCalledWith({ pageNumber: 1, pageSize: 10, searchTerm: "mega" });
  });
});
