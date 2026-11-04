import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { ItemReturnComponent } from "./ItemReturn.component";
import type { ReturnListState, ReturnRow } from "./ItemReturn.type";

describe("ItemReturnComponent", () => {
  const mockRow: ReturnRow = {
    id: "return-1",
    orderId: "ORD-001",
    returnDate: "2026-11-03T10:00:00.000Z",
    itemCount: 3,
    notes: "Semua lengkap",
    status: "active",
  };

  const defaultProps: ReturnListState = {
    currentPage: 1,
    totalPages: 2,
    pageSize: 10,
    totalCount: 15,
    rows: [mockRow],
    isLoading: false,
    errorMessage: null,
    isEmpty: false,
    setSearchTerm: jest.fn(),
    goToPage: jest.fn(),
    changePageSize: jest.fn(),
    onCreate: jest.fn(),
    onEdit: jest.fn(),
    onRowClick: jest.fn(),
    onBack: jest.fn(),
  };

  const renderComponent = (props: ReturnListState = defaultProps) =>
    render(
      <BrowserRouter>
        <ItemReturnComponent {...props} />
      </BrowserRouter>,
    );

  it("should render page title and return data in table and card", () => {
    renderComponent();

    expect(screen.getAllByText("Item Return").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Create New").length).toBeGreaterThan(0);
    expect(screen.getAllByText("ORD-001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("3 items").length).toBeGreaterThan(0);
  });

  it("should call onRowClick when mobile card is clicked", () => {
    renderComponent();

    const cardButton = screen.getAllByRole("button").find((btn) => btn.textContent?.includes("ORD-001"));
    expect(cardButton).toBeDefined();

    if (cardButton) {
      fireEvent.click(cardButton);
      expect(defaultProps.onRowClick).toHaveBeenCalledWith(mockRow);
    }
  });

  it("should render empty state when isEmpty is true", () => {
    renderComponent({
      ...defaultProps,
      rows: [],
      isEmpty: true,
    });

    expect(screen.getAllByText("No item returns found.").length).toBeGreaterThan(0);
  });

  it("should render error message when errorMessage is provided", () => {
    renderComponent({
      ...defaultProps,
      rows: [],
      errorMessage: "Gagal memuat data",
    });

    expect(screen.getAllByText("Gagal memuat data").length).toBeGreaterThan(0);
  });
});
