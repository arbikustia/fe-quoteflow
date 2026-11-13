import type * as React from "react";

import { fireEvent, render, screen } from "@/libs/unit-test";

import { ItemReturnComponent } from "./ItemReturn.component";
import type { ReturnListState, ReturnRow } from "./ItemReturn.type";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>,
}));

jest.mock("@/app/shared/PageLayout", () => ({
  PageLayout: ({ children, headerRight, title }: { children: React.ReactNode; headerRight: React.ReactNode; title: string }): React.ReactElement => (
    <section><h1>{title}</h1>{headerRight}{children}</section>
  ),
}));

const mockRow: ReturnRow = {
  id: "return-1",
  customerName: "Customer Name",
  returnDate: "2026-11-03T10:00:00",
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

describe("ItemReturnComponent", (): void => {
  it("should render page title and return data in table and card", (): void => {
    render(<ItemReturnComponent {...defaultProps} />);

    expect(screen.getAllByText("Item Return List").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Create Item Return" })).not.toBeNull();
    expect(screen.getAllByText("3 items").length).toBeGreaterThan(0);
    expect(screen.getAllByText("active")[0].className).toContain("uppercase");
  });

  it("should call onRowClick when mobile card is clicked", (): void => {
    render(<ItemReturnComponent {...defaultProps} />);

    const cardButton = screen.getAllByRole("button").find((btn) => btn.textContent?.includes("Customer Name"));

    fireEvent.click(cardButton as HTMLElement);

    expect(defaultProps.onRowClick).toHaveBeenCalledWith(mockRow);
  });

  it("should call onEdit without row click when edit is clicked", (): void => {
    render(<ItemReturnComponent {...defaultProps} />);

    fireEvent.click(screen.getByLabelText("Edit Customer Name"));

    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockRow);
  });

  it("should call create and search handlers", (): void => {
    render(<ItemReturnComponent {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Create Item Return" }));
    fireEvent.change(screen.getAllByPlaceholderText("Search item return")[0], { target: { value: "abc" } });

    expect(defaultProps.onCreate).toHaveBeenCalled();
    expect(defaultProps.setSearchTerm).toHaveBeenCalledWith("abc");
  });

  it("should render skeletons while loading", (): void => {
    render(<ItemReturnComponent {...defaultProps} isLoading={true} rows={[]} />);

    expect(screen.getByLabelText("Loading item return table")).not.toBeNull();
    expect(screen.getAllByLabelText("Loading item return card").length).toBe(5);
  });

  it("should render empty state when isEmpty is true", (): void => {
    render(<ItemReturnComponent {...defaultProps} rows={[]} isEmpty={true} />);

    expect(screen.getAllByText("No item returns found.").length).toBeGreaterThan(0);
  });

  it("should render error message when errorMessage is provided", (): void => {
    render(<ItemReturnComponent {...defaultProps} rows={[]} errorMessage="Gagal memuat data" />);

    expect(screen.getAllByText("Gagal memuat data").length).toBeGreaterThan(0);
  });
});
