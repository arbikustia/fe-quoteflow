import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { MasterCustomerComponent } from "./MasterCustomer.component";
import { MOCK_CUSTOMERS } from "../../fixture/master-customer";

jest.mock("../../components/Pagination", () => ({
  Pagination: () => <div data-testid="pagination" />,
}));
jest.mock("react-icons/fi", () => ({
  FiChevronRight: () => <div data-testid="chevron-right-icon" />,
  FiEdit2: () => <div data-testid="edit-icon" />,
  FiMapPin: () => <div data-testid="map-pin-icon" />,
  FiPhone: () => <div data-testid="phone-icon" />,
  FiSearch: () => <div data-testid="search-icon" />,
  FiUser: () => <div data-testid="user-icon" />,
}));
jest.mock("../../components/Icons", () => ({
  Icons: {
    Search: () => <div data-testid="search-icon" />,
  },
}));
jest.mock("../../app/layout", () =>
  ({ children }: { children: React.ReactNode }) => <div data-testid="mock-layout">{children}</div>,
);

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
    isLoading: false,
    errorMessage: null,
    isEmpty: false,
    isMissingData: false,
    setSearchTerm: jest.fn(),
    goToPage: jest.fn(),
    nextPage: jest.fn(),
    prevPage: jest.fn(),
    changePageSize: jest.fn(),
    onCreate: jest.fn(),
    onEdit: jest.fn(),
    onDetail: jest.fn(),
    onRowClick: jest.fn(),
    onBack: jest.fn(),
    onMore: jest.fn(),
    onCloseMore: jest.fn(),
    onDelete: jest.fn(),
  };

  const renderComponent = (props = mockProps) => {
    return render(
      <BrowserRouter>
        <MasterCustomerComponent {...props} />
      </BrowserRouter>
    );
  };

  it("should render customer card and open edit", () => {
    renderComponent();

    const customer = mockProps.paginatedData[0];
    const customerName = screen.getAllByText(customer.name)[0];

    expect(screen.getAllByText(customer.address ?? "No address provided")[0]).toBeInTheDocument();
    expect(screen.getAllByText(customer.phoneNumber ?? "No phone number")[0]).toBeInTheDocument();

    fireEvent.click(customerName.closest("button")!);

    expect(mockProps.onEdit).toHaveBeenCalledWith(customer);
  });

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
