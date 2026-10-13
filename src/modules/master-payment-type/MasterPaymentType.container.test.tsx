import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import MasterPaymentTypeContainer from "./MasterPaymentType.container";
import { useGetPaymentTypesQuery } from "./MasterPaymentType.api";

jest.mock("./MasterPaymentType.api", () => ({
  useGetPaymentTypesQuery: jest.fn(),
  useCreatePaymentTypeMutation: jest.fn(),
  _mapPaymentType: (paymentType: { readonly id: string; readonly name: string; readonly status: number; readonly created_at: string | null; readonly created_by: string | null }) => ({
    id: paymentType.id,
    name: paymentType.name,
    status: paymentType.status === 1 ? "active" : "inactive",
    createAt: paymentType.created_at ?? "",
    createBy: paymentType.created_by ?? "",
  }),
}));

// Mock the component to avoid rendering the full UI
jest.mock("./MasterPaymentType.component", () => ({
  MasterPaymentTypeComponent: () => <div data-testid="mock-component" />,
}));

const mockQueryResult = {
  data: {
    status: true,
    messages: null,
    data: {
      data: [
        {
          id: "1",
          name: "Cash",
          status: 1,
          created_at: "2024-01-15 10:30",
          created_by: "Admin",
          updated_at: null,
        },
      ],
      page_number: 1,
      total_pages: 2,
      total_count: 11,
      has_previous: false,
      has_next: true,
    },
  },
  error: undefined,
  isLoading: false,
};

describe("MasterPaymentType Container", () => {
  it("should render component while query resolves from API", () => {
    jest.mocked(useGetPaymentTypesQuery).mockReturnValue(mockQueryResult as never);

    render(
      <BrowserRouter>
        <MasterPaymentTypeContainer />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("mock-component")).toBeInTheDocument();
    expect(useGetPaymentTypesQuery).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 10, searchTerm: "" });
  });

});