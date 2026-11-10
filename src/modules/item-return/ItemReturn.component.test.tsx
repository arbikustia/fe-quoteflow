import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { ItemReturnComponent } from "./ItemReturn.component";
import type { ReturnListState, ReturnRow } from "./ItemReturn.type";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/app/shared/PageLayout", () => ({
  PageLayout: ({ children, headerRight, title }: { children: React.ReactNode; headerRight: React.ReactNode; title: string }) => (
    <section><h1>{title}</h1>{headerRight}{children}</section>
  ),
}));

describe("ItemReturnComponent", () => {
  const mockRow: ReturnRow = {
    id: "return-1",
    customerName: "Customer Name",
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

    expect(screen.getAllByText("Item Return List").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Create Item Return" })).toBeInTheDocument();
    expect(screen.getAllByText("Create New").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Customer Name").length).toBeGreaterThan(0);
    expect(screen.getAllByText("3 items").length).toBeGreaterThan(0);
    expect(screen.getAllByText("active")[0]).toHaveClass("border-current", "px-3", "py-1", "text-base", "uppercase");
  });

  it("should call onRowClick when mobile card is clicked", () => {
    renderComponent();

    const cardButton = screen.getAllByRole("button").find((btn) => btn.textContent?.includes("Customer Name"));
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
