import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { MasterCustomerComponent } from "./MasterCustomer.component";
import { MOCK_CUSTOMERS } from "../../fixture/master-customer";

// Mock the icons to simplify snapshots
vi.mock("react-icons/fi", () => ({
  FiEdit2: () => <div data-testid="edit-icon" />,
}));
vi.mock("../../components/Icons", () => ({
  Icons: {
    Search: () => <div data-testid="search-icon" />,
  },
}));
vi.mock("../../app/layout", () => ({
  default: ({ children }: any) => <div data-testid="mock-layout">{children}</div>,
}));

describe("MasterCustomer Component", () => {
  const mockProps = {
    currentPage: 1,
    totalPages: 2,
    pageSize: 10,
    paginatedData: MOCK_CUSTOMERS.slice(0, 10),
    totalCount: MOCK_CUSTOMERS.length,
    columns: [
      { key: "no", header: "No" },
      { key: "name", header: "Customer Name" },
      { key: "address", header: "Address" },
      { key: "phoneNumber", header: "Phone Number" },
      { key: "status", header: "Status" },
      { key: "actions", header: "Action" },
    ],
    isMoreOpen: false,
    goToPage: vi.fn(),
    nextPage: vi.fn(),
    prevPage: vi.fn(),
    changePageSize: vi.fn(),
    onCreate: vi.fn(),
    onEdit: vi.fn(),
    onRowClick: vi.fn(),
    onBack: vi.fn(),
    onMore: vi.fn(),
    onCloseMore: vi.fn(),
    onDelete: vi.fn(),
  };

  const renderComponent = (props = mockProps) => {
    return render(
      <BrowserRouter>
        <MasterCustomerComponent {...props} />
      </BrowserRouter>
    );
  };

  describe("MasterCustomerComponent Snapshots", () => {
    it("default state", () => {
      const { asFragment } = renderComponent();
      expect(asFragment()).toMatchSnapshot();
    });

    it("more open state", () => {
      const { asFragment } = renderComponent({ ...mockProps, isMoreOpen: true });
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
