import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { MOCK_ORDER_TYPES } from "../../fixture/master-order-type";
import { MasterOrderTypeComponent } from "./MasterOrderType.component";

import type { MasterOrderTypeProps } from "./MasterOrderType.type";

jest.mock("../../components/Pagination", () => ({
  Pagination: () => <div data-testid="pagination" />,
}));
jest.mock("react-icons/fi", () => ({
  FiEdit2: () => <div data-testid="edit-icon" />,
  FiSearch: () => <div data-testid="search-icon" />,
}));
jest.mock("../../app/layout", () =>
  ({ children }: { children: React.ReactNode }) => <div data-testid="mock-layout">{children}</div>,
);

describe("MasterOrderType Component", () => {
  const mockProps: MasterOrderTypeProps = {
    currentPage: 1,
    totalPages: 2,
    pageSize: 10,
    paginatedData: MOCK_ORDER_TYPES,
    totalCount: MOCK_ORDER_TYPES.length,
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
    onRowClick: jest.fn(),
    onBack: jest.fn(),
    onMore: jest.fn(),
    onCloseMore: jest.fn(),
    onDelete: jest.fn(),
  };

  const renderComponent = (props = mockProps) => {
    return render(
      <BrowserRouter>
        <MasterOrderTypeComponent {...props} />
      </BrowserRouter>,
    );
  };

  it("should render order type card and trigger onEdit", () => {
    renderComponent();

    const orderType = mockProps.paginatedData[0];
    const cardTitle = screen.getAllByText(orderType.name)[0];

    expect(screen.getAllByText("Handover Required")[0]).toBeInTheDocument();

    fireEvent.click(cardTitle.closest("button")!);
    expect(mockProps.onEdit).toHaveBeenCalledWith(orderType);
  });

  it("should trigger onCreate when Create New button clicked", () => {
    renderComponent();

    const createBtns = screen.getAllByRole("button", { name: "Create New" });
    expect(createBtns[0].classList.contains("lg:hidden")).toBe(true);
    fireEvent.click(createBtns[0]);
    expect(mockProps.onCreate).toHaveBeenCalled();

    const desktopCreateBtn = screen.getByRole("button", { name: "Create Order Type" });
    fireEvent.click(desktopCreateBtn);
    expect(mockProps.onCreate).toHaveBeenCalledTimes(2);
  });

  it("should render Yes or No in Handover column", () => {
    renderComponent();

    expect(screen.getAllByText("Yes").length).toBeGreaterThan(0);
    expect(screen.getAllByText("No").length).toBeGreaterThan(0);
  });

  it("should render loading state", () => {
    const { container } = renderComponent({ ...mockProps, isLoading: true });

    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("should render empty state", () => {
    renderComponent({ ...mockProps, isEmpty: true, paginatedData: [] });

    expect(screen.getAllByText("No order types found.")).toHaveLength(2);
  });

  it("should render error message", () => {
    renderComponent({ ...mockProps, errorMessage: "Failed to fetch order types" });

    expect(screen.getAllByText("Failed to fetch order types")).toHaveLength(2);
  });
});
